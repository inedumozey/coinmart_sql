const axios = require('axios')
require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { Client, resources, Webhook } = require('coinbase-commerce-node');
const pool = require("../../db/conn");
const ran = require("../../auth/utils/randomString");

const CC_API_KEY = process.env.CC_API_KEY;
const CC_WEBHOOK_SECRET = process.env.CC_WEBHOOK_SECRET

Client.init(CC_API_KEY);
const { Charge } = resources;

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

module.exports = {

    deposit: async (req, res) => {
        try {
            await pool.query('BEGIN')
            const userId = req.user
            const userData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId]);
            const user = userData.rows[0]

            // sanitize all elements from the client, incase of fodgery
            // amount is in dollars
            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
            }

            // get all config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]
            const name = process.env.NAME
            const bio = process.env.BIO;

            if (!data.amount) {
                return res.status(400).json({ status: false, msg: "Please enter amount" })
            }

            const chargeData = {
                name: name,
                description: bio,
                local_price: {
                    amount: data.amount,
                    currency: 'USD'
                },
                pricing_type: "fixed_price",
                metadata: {
                    customer_id: userId,
                    customer_name: user.username
                },

                redirect_url: `${process.env.FRONTEND_BASE_URL}/dashboard`,
                cancel_url: `${process.env.FRONTEND_BASE_URL}/dashboard`
            }

            const charge = await Charge.create(chargeData)
            const amountExpected = Number(charge.pricing.local.amount);

            // console.log(charge)

            // // save info to the databse
            const newDeposit = await pool.query(`INSERT INTO
            deposit(
                _id,
                users_id,
                code,
                amount_expected,
                amount_received,
                over_paid_by,
                under_paid_by,
                over_payment_threshold,
                under_payment_threshold,
                status,
                link
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
                [
                    ran.uuid(),
                    charge.metadata.customer_id,
                    charge.code,
                    amountExpected,
                    0,
                    0,
                    0,
                    charge.payment_threshold.overpayment_relative_threshold,
                    charge.payment_threshold.underpayment_relative_threshold,
                    "charge-created",
                    charge.hosted_url
                ]
            )

            await pool.query('COMMIT')
            const newDepositData = newDeposit.rows[0];

            const data_ = {
                hostedUrl: newDepositData.link,
                redirecturl: chargeData.redirect_url,
                cancelUrl: chargeData.cancel_url,
            }

            // send the redirect to the client
            return res.status(200).json({ status: true, msg: 'Charge created, you will be redirected to pay shortly', data: data_ })

        }
        catch (err) {
            console.log(err.message)
            await pool.query('REVOKE')
            if (err.response) {
                return res.status(500).json({ status: false, msg: err.response.data })

            } else {
                if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT') || err.message.includes('ESOCKETTIMEDOUT')) {
                    return res.status(500).json({ status: false, msg: 'Poor network connection' })
                }
                else {
                    return res.status(500).json({ status: false, msg: err.message })
                }
            }
        }
    },

    depositWebhook: async (req, res) => {
        try {
            const rawBody = req.rawBody;
            const signature = req.headers['x-cc-webhook-signature'];
            const webhookSecret = CC_WEBHOOK_SECRET;
            const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

            // get the deposit database
            const depositHxData = await pool.query(`SELECT * from deposit WHERE code=$1`, [event.data.code]);
            const depositHx = depositHxData.rows[0]

            // charge canceled
            if (event.type === 'charge:failed' && !event.data.payments[0] && depositHx.status === 'charge-created') {
                //update the table
                await pool.query('UPDATE deposit SET comment=$1, status=$2 WHERE code=$3', ['canceled', 'charge-failed', event.data.code]);
            }

            // charge pending
            else if (event.type === 'charge:pending' && depositHx.status === 'charge-created') {
                //update the table
                await pool.query('UPDATE deposit SET comment=$1, status=$2 WHERE code=$3', ['pending', 'charge-pending', event.data.code]);
            }

            // charge conmfirmed
            else if (event.type === 'charge:confirmed' && (depositHx.status === 'charge-pending' || depositHx.status === 'charge-created')) {
                const amountReceived_ = event.data.payments[0].value.crypto.amount;
                const cryptocurrency = event.data.payments[0].value.crypto.currency;

                // convert amount received from whatever the currency paid with to USD
                const res = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${cryptocurrency}`);
                const amountReceived = Number(res.data.data.rates.USD) * Number(amountReceived_);

                const amountReceive = amountReceived.toFixed(8);

                //update the table
                const tnxData = await pool.query(`UPDATE deposit SET
                    comment=$1,
                    status=$2,
                    amount_received=$3
                    WHERE code=$4
                    RETURNING *`,
                    ['successful', 'charge-confirmed', amountReceive, event.data.code]
                );
                const tnx = tnxData.rows[0]

                // update the user's account with the amount recieved (nativeAmountReceived); only get the users whose status is still pending
                await pool.query(`UPDATE users SET amount=amount+$1 WHERE users_id=$2`, [amountReceive, tnx.users_id]);
            }

            // charge incorrect payment (overpayment/underpayment)
            else if ((event.type === 'charge:failed' && event.data.payments[0]) && (depositHx.status === 'charge-pending' || depositHx.status === 'charge-created')) {
                const amountExpected = Number(depositHx.tradeAmountExpected)
                const amountReceived_ = Number(event.data.payments[0].value.crypto.amount);
                const cryptocurrency = event.data.payments[0].value.crypto.currency;
                const overpayment_threshold = Number(event.data.payment_threshold.overpayment_relative_threshold);

                // convert amount received from whatever the currency paid with to USD
                const res = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${cryptocurrency}`);
                const amountReceived = Number(res.data.data.rates.USD) * Number(amountReceived_);

                // const isUnderpaid = (amountReceived < amountExpected) && (amountExpected - amountReceived < underpayment_threshold);

                const isOverpaid = (amountReceived > amountExpected) && (amountReceived - amountExpected > (overpayment_threshold - 0.004));


                const resolveComent = () => {

                    if (isOverpaid) {
                        return "overpayment"
                    }

                    else {
                        return "underpayment"
                    }
                }

                const resolveOverPayment = () => {
                    if (isOverpaid) {
                        const amountDiff = amountReceived - amountExpected
                        return amountDiff.toFixed(8)
                    }

                    else {
                        return 0
                    }
                }

                const resolveUnderPayment = () => {
                    if (!isOverpaid) {
                        const amountDiff = amountExpected - amountReceived
                        return amountDiff.toFixed(8)
                    }

                    else {
                        return 0
                    }
                }

                const amountReceive = amountReceived.toFixed(8);

                //update the table
                const tnxData = await pool.query(`UPDATE deposit SET
                    comment=$1,
                    status=$2,
                    over_paid_by=$3,
                    under_paid_by=$4,
                    amount_received=$5
                    WHERE code=$6
                    RETURNING *`,
                    [
                        resolveComent(),
                        'charge-confirmed',
                        resolveOverPayment(),
                        resolveUnderPayment(),
                        amountReceive,
                        event.data.code
                    ]
                );

                const tnx = tnxData.rows[0]

                // update the user's account with the amount recieved (nativeAmountReceived); only get the users whose status is still pending
                await pool.query(`UPDATE users SET amount=amount+$1 WHERE users_id=$2`, [amountReceive, tnx.users_id]);
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllDeposits_admin: async (req, res) => {
        try {

            // get currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx() {
                // get all deposits
                const depositHxResult = await pool.query(`SELECT * FROM deposit ORDER BY updated_at DESC`);
                const depositHx = depositHxResult.rows;

                // find every users that owns this deposit hx
                let usersIdArr = []
                for (let i = 0; i < depositHx.length; i++) {
                    usersIdArr.push(depositHx[i].users_id)
                }
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=ANY($1)`, [usersIdArr]);
                let users = userResult.rows;

                let depositHxData = []
                for (let i = 0; i < depositHx.length; i++) {
                    users.filter(users => {
                        if (depositHx[i].users_id === users.users_id) {
                            let obj = {
                                _id: depositHx[i]._id,
                                code: depositHx[i].code,
                                link: depositHx[i].link,
                                amountExpected: depositHx[i].amount_expected,
                                amountReceived: depositHx[i].amount_received,
                                overPaymentThreshold: depositHx[i].over_payment_threshold,
                                underPaymentThreshold: depositHx[i].under_payment_threshold,
                                overPaidBy: depositHx[i].over_paid_by,
                                underPaidBy: depositHx[i].under_paid_by,
                                status: depositHx[i].status,
                                comment: depositHx[i].comment,
                                transactionType: depositHx[i].transaction_type,
                                createdAt: depositHx[i].created_at,
                                updatedAt: depositHx[i].updated_at,
                                currency,
                                userId: {
                                    _id: users.users_id,
                                    email: users.email,
                                    username: users.username,
                                    role: users.role,
                                }
                            }
                            depositHxData.push(obj)
                        }
                    })
                }
                return depositHxData;
            }
            const depositData = await getHx()
            return res.status(200).json({ status: true, msg: 'successful', data: depositData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllDeposits_users: async (req, res) => {
        try {
            const userId = req.user
            // get all deposit hx from the database
            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx() {
                // get deposit hx from the database
                const depositHxResult = await pool.query(`SELECT * FROM deposit WHERE users_id=$1 ORDER BY created_at DESC`, [userId]);
                const depositHx = depositHxResult.rows;

                // find the user that owns this deposit hx
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=$1`, [userId]);
                let users = userResult.rows[0];

                let depositHxData = []
                for (let i = 0; i < depositHx.length; i++) {
                    let obj = {
                        _id: depositHx[i]._id,
                        code: depositHx[i].code,
                        link: depositHx[i].link,
                        amountExpected: depositHx[i].amount_expected,
                        amountReceived: depositHx[i].amount_received,
                        overPaymentThreshold: depositHx[i].over_payment_threshold,
                        underPaymentThreshold: depositHx[i].under_payment_threshold,
                        overPaidBy: depositHx[i].over_paid_by,
                        underPaidBy: depositHx[i].under_paid_by,
                        status: depositHx[i].status,
                        comment: depositHx[i].comment,
                        transactionType: depositHx[i].transaction_type,
                        createdAt: depositHx[i].created_at,
                        updatedAt: depositHx[i].updated_at,
                        currency,
                        userId: {
                            _id: users.users_id,
                            email: users.email,
                            username: users.username,
                            role: users.role,
                        }
                    }
                    depositHxData.push(obj)
                }
                return depositHxData;
            }

            const depositData = await getHx()

            return res.status(200).json({ status: true, msg: "Successful", data: depositData })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.response.data })
        }
    },

    resolve: async (req, res) => {
        try {
            const { id } = req.params;

            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
            }

            if (!data.amount) {
                return res.status(400).json({ status: false, msg: 'The field is required' })
            }
            else {

                // find the deposit hx
                const txnData = await pool.query(`SELECT * FROM deposit WHERE _id=$1`, [id])
                const txn = txnData.rows[0]

                if (txn.status === 'charge-confirmed') {
                    return res.status(400).json({ status: false, msg: 'This transaction is alread successful' })
                }
                else {
                    //find and update transaction in deposit and transaction hx
                    const newDataData = await pool.query(`UPDATE deposit SET
                        comment=$1,
                        status=$2,
                        amount_received=$3
                        WHERE _id=$4
                        RETURNING *`,
                        [
                            'Manual',
                            'charge-confirmed',
                            data.amount.toFixed(8),
                            id
                        ]
                    )

                    const newData = newDataData.rows[0]

                    // find the user and update his/her acount balance
                    await pool.query(`UPDATE users SET amount=amount+$1 WHERE users_id=$2`,
                        [
                            data.amount,
                            newData.users_id
                        ]
                    )

                    return res.status(200).json({ status: true, msg: 'successfu', data: newData })
                }
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // 10 most recent confirmed deposit hx
    latest: async (req, res) => {
        try {
            // get currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx(status) {
                // get deposit hx from the database
                const depositHxResult = await pool.query(`SELECT * FROM deposit ORDER BY updated_at DESC LIMIT 10`);
                const depositHx = depositHxResult.rows;

                // find every users that owns this deposit hx
                let usersIdArr = []
                for (let i = 0; i < depositHx.length; i++) {
                    usersIdArr.push(depositHx[i].users_id)
                }
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=ANY($1)`, [usersIdArr]);
                let users = userResult.rows;

                let depositHxData = []
                for (let i = 0; i < depositHx.length; i++) {
                    users.filter(users => {
                        if (depositHx[i].users_id === users.users_id) {
                            let obj = {
                                _id: depositHx[i]._id,
                                amountReceived: depositHx[i].amount_received,
                                transactionType: depositHx[i].transaction_type,
                                createdAt: depositHx[i].created_at,
                                updatedAt: depositHx[i].updated_at,
                                currency,
                                userId: {
                                    _id: users.users_id,
                                    email: users.email,
                                    username: users.username,
                                    role: users.role,
                                }
                            }
                            depositHxData.push(obj)
                        }
                    })
                }
                return depositHxData;
            }

            const data = await getHx();
            return res.status(200).json({ status: true, msg: 'successful', data })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}
