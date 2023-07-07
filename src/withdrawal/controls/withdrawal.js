require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const mailgunSetup = require('../../config/mailgun');
const pool = require('../../db/conn');
const ran = require('../../auth/utils/randomString')

const URL_ADMIN = `${process.env.FRONTEND_BASE_URL}/${process.env.WITHDRAWAL_REQUEST_ADMIN}`
const URL_USER = `${process.env.FRONTEND_BASE_URL}/${process.env.WITHDRAWAL_REQUEST_USER}`

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

module.exports = {

    request: async (req, res) => {
        try {
            pool.query('BEGIN')
            const userId = req.user;
            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
                coin: DOMPurify.sanitize(req.body.coin),
                walletAddress: DOMPurify.sanitize(req.body.walletAddress)
            };

            // get currency, withdrawalCoins, maxWithdrawalLimit, minWithdrawalLimit and withdrawalCommomDifference from config data if exist otherwise set to the one in env

            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows
            const currency = config[0].currency
            const withdrawableCoins = config[0].withdrawable_coins
            const withdrawableFactors = config[0].withdrawable_factors
            const pendingWithdrawalDuration = config[0].pending_withdrawal_duration;
            const allowWithdrawal = config[0].allow_withdrawal;


            if (!allowWithdrawal) {
                return res.status(400).json({ status: false, msg: "Currenctly not available, please try again later later" })
            }

            if (!data.amount || !data.walletAddress) {
                return res.status(400).json({ status: false, msg: "All fields are required" });
            }

            // validate
            if (!data.coin) {
                return res.status(400).json({ status: false, msg: "Please select a coin" });
            }

            // check for withdrawable factors
            // if withdrawableFactors is 1, users can withdraw any amount otherwise, users can only withdraw amount in the withdrawableFactors array
            if (withdrawableFactors.length !== 1 && withdrawableFactors[0] !== 1) {
                if (!withdrawableFactors.includes(data.amount)) {
                    return res.status(400).json({ status: false, msg: "Invalid amount" });
                }
            }

            // check if coin selected is valid
            if (!withdrawableCoins.includes(data.coin)) {
                return res.status(400).json({ status: false, msg: "Unsupported coin" });
            }

            // amount requested for should not be more than their account total balance
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]

            if (data.amount > user.amount) {
                return res.status(400).json({ status: false, msg: "Insulficient balance" });
            }

            // get all Withdrawal hx, and check if the user has a pending transaction
            const pendingResult = await pool.query(`SELECT * FROM withdrawal WHERE users_id=$1 AND status=$2`, [userId, 'pending'])
            const pending = pendingResult.rows;

            // if (pending.length) {
            //     return res.status(400).json({ status: false, msg: "You have a pending transaction" });
            // }

            // save this data in Withdrawal database
            const newDataResult = await pool.query(`INSERT INTO
                withdrawal(
                    _id,
                    users_id,
                    wallet_address,
                    coin,
                    amount
                )
                VALUES($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    ran.uuid(),
                    userId,
                    data.walletAddress,
                    data.coin,
                    (data.amount).toFixed(8),
                ]
            )

            const newData_ = newDataResult.rows[0]

            if (process.env.ENV !== 'development') {
                // send email to admin
                const text = `
                    <div> <span style="font-weight: bold">${user.username}</span> just placed a Withdrawal Request </div>
                    <br />
                    <br />
                    <div> Amount: ${data.amount.toFixed(4)} ${currency} </div>
                    <br />
                    <div> Wallet: ${data.walletAddress} <div/ >
                    <br />
                    <div> Coin: ${data.coin} <div/ >
                    <br />
                    <div> Transaction Id: ${newData_.users_id} </div>
                    <br />
                    <div> Date: ${new Date(newData_.created_at).toLocaleString()} </div>
                    <br />
                    <div>
                        <a style="text-align:center; font-weight: 600" href="${URL_ADMIN}">Click to Resolve</a>
                    </div>
                    <br />
                    <div>${URL_ADMIN}</div>
                `
                const email_data = {
                    from: `${process.env.NAME}. <${process.env.EMAIL_USER2}>`,
                    to: [process.env.EMAIL_USER],
                    subject: 'New Withdrawal Request',
                    html: text
                }

                mailgunSetup.messages().send(email_data, async (err, resp) => {
                    if (err) {
                        pool.query('ROLLBACK');

                        if (err.message.includes("ENOTFOUND") || err.message.includes("EREFUSED") || err.message.includes("EHOSTUNREACH")) {
                            return res.status(408).json({ status: false, msg: "No network connectivity" })
                        }
                        else if (err.message.includes("ETIMEDOUT")) {
                            return res.status(408).json({ status: false, msg: "Request Time-out! Check your network connections" })
                        }
                        else {
                            return res.status(500).json({ status: false, msg: err.message });
                        }
                    }
                    else {

                        // remove the amount from the user's account balance
                        const amount = (user.amount - data.amount).toFixed(8)
                        const newUserDataResult = await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2 RETURNING *`, [amount, userId]);

                        const newUserData = newUserDataResult.rows[0];
                        const withdrawalData = {
                            userId: {
                                _id: newUserData.users_id,
                                username: newUserData.username,
                                email: newUserData.email,
                            },
                            _id: newData_._id,
                            walletAddress: newData_.wallet_address,
                            coin: newData_.coin,
                            amount: newData_.amount,
                            status: newData_.status,
                            transactionType: newData_.transaction_type,
                            createdAt: newData_.created_at,
                            updatedAt: newData_.updated_at,
                            currency
                        }
                        pool.query('COMMIT');

                        return res.status(200).json({ status: true, msg: `Pending transaction! It will be resolved within ${pendingWithdrawalDuration} hours`, data: withdrawalData })
                    }
                });
            }
            else {
                // remove the amount from the user's account balance
                const amount = (user.amount - data.amount).toFixed(8)
                const newUserDataResult = await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2 RETURNING *`, [amount, userId]);

                const newUserData = newUserDataResult.rows[0];
                const withdrawalData = {
                    userId: {
                        _id: newUserData.users_id,
                        username: newUserData.username,
                        email: newUserData.email,
                    },
                    _id: newData_.users_id,
                    walletAddress: newData_.wallet_address,
                    coin: newData_.coin,
                    amount: newData_.amount,
                    status: newData_.status,
                    transactionType: newData_.transaction_type,
                    createdAt: newData_.created_at,
                    updatedAt: newData_.updated_at,
                    currency
                }
                pool.query('COMMIT')

                return res.status(200).json({ status: true, msg: `Pending transaction! It will be resolved within ${pendingWithdrawalDuration} hours`, data: withdrawalData })
            }
        }
        catch (err) {
            pool.query('ROLLBACK')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    rejected: async (req, res) => {
        try {
            await pool.query("BEGIN");

            const { id } = req.params;

            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            // get this withdrawal hx from the database
            const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE _id=$1`, [id])
            const withdrawalHx = withdrawalHxResult.rows[0];

            if (!withdrawalHx) {
                return res.status(400).json({ status: false, msg: "Transaction not found" })
            }

            if (withdrawalHx.status === 'rejected') {
                return res.status(400).json({ status: false, msg: "Transaction already rejected" });
            }

            if (withdrawalHx.status === 'confirmed') {
                return res.status(400).json({ status: false, msg: "Transaction already confirmed" });
            }

            // update the Withdrawal database and change the status to rejected
            const withdrawalDataResult = await pool.query(`UPDATE withdrawal SET
                status=$1,
                updated_at=$2

                WHERE _id=$3
                RETURNING *`,
                ['rejected', new Date(), id]
            );
            const withdrawalData = withdrawalDataResult.rows[0]

            // add the removed amount to the user's account balance
            let userResult = await pool.query(`UPDATE users SET amount=amount+$1 WHERE users_id=$2 RETURNING *`, [withdrawalData.amount, withdrawalData.users_id]);
            const user = userResult.rows[0];

            const obj = {
                userId: {
                    _id: user.users_id,
                    username: user.username,
                    email: user.email
                },
                _id: withdrawalData._id,
                walletAddress: withdrawalData.wallet_address,
                coin: withdrawalData.coin,
                amount: withdrawalData.amount,
                status: withdrawalData.status,
                transactionType: withdrawalData.transaction_type,
                createdAt: withdrawalData.created_at,
                updatedAt: withdrawalData.updated_at,
                currency
            }

            if (process.env.ENV !== 'development') {
                // send email to admin
                const text = `
                    <div> Your Withdrawal Request was rejected </div>
                    <br />
                    <div> Amount: ${obj.amount} ${currency} </div>
                    <br />
                    <div> Wallet: ${obj.wallet_address} <div/ >
                    <br />
                    <div> Wallet: ${obj.coin} <div/ >
                    <br />
                    <div> Transaction Id: ${obj._id} </div>
                    <br />
                    <div> Date: ${new Date(obj.updatedt).toLocaleString()} </div>
                    <br />
                    <div>
                        <a style="text-align:center; font-weight: 600" href="${URL_USER}">Click to Resolve</a>
                    </div>
                    <br />
                    <div>${URL_USER}</div>
                `
                const email_data = {
                    from: `${process.env.NAME}. <${process.env.EMAIL_USER2}>`,
                    to: user.email,
                    subject: 'Withdrawal Transaction',
                    html: text
                }

                mailgunSetup.messages().send(email_data, async (err, resp) => {
                    if (err) {
                        await pool.query('ROLLBACK')

                        if (err.message.includes("ENOTFOUND") || err.message.includes("EREFUSED") || err.message.includes("EHOSTUNREACH")) {
                            return res.status(408).json({ status: false, msg: "No network connectivity" })
                        }
                        else if (err.message.includes("ETIMEDOUT")) {
                            return res.status(408).json({ status: false, msg: "Request Time-out! Check your network connections" })
                        }
                        else {
                            return res.status(500).json({ status: false, msg: err.message });
                        }
                    }
                    else {
                        await pool.query('COMMIT')

                        return res.status(200).json({ status: true, msg: `withdrawal to this wallet ${obj.walletAddress} was rejected`, data: obj })
                    }
                });
            }
            else {
                await pool.query('COMMIT')

                return res.status(200).json({ status: true, msg: `withdrawal to this wallet ${obj.walletAddress} was rejected`, data: obj })
            }
        }
        catch (err) {
            await pool.query('ROLLBACK')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    confirm: async (req, res) => {
        try {
            await pool.query("BEGIN");

            const { id } = req.params;

            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            // get this withdrawal hx from the database
            const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE _id=$1`, [id])
            const withdrawalHx = withdrawalHxResult.rows[0];

            if (!withdrawalHx) {
                return res.status(400).json({ status: false, msg: "Transaction not found" })
            }

            if (withdrawalHx.status === 'rejected') {
                return res.status(400).json({ status: false, msg: "Transaction already rejected" });
            }

            if (withdrawalHx.status === 'confirmed') {
                return res.status(400).json({ status: false, msg: "Transaction already confirmed" });
            }

            // update the Withdrawal database and change the status to rejected
            const withdrawalDataResult = await pool.query(`UPDATE withdrawal SET
                status=$1,
                updated_at=$2

                WHERE _id=$3
                RETURNING *`,
                ['confirmed', new Date(), id]
            );
            const withdrawalData = withdrawalDataResult.rows[0]

            // add the removed amount to the user's account balance
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [withdrawalData.users_id]);
            const user = userResult.rows[0];

            const obj = {
                userId: {
                    _id: user.users_id,
                    username: user.username,
                    email: user.email
                },
                _id: withdrawalData._id,
                walletAddress: withdrawalData.wallet_address,
                coin: withdrawalData.coin,
                amount: withdrawalData.amount,
                status: withdrawalData.status,
                transactionType: withdrawalData.transaction_type,
                createdAt: withdrawalData.created_at,
                updatedAt: withdrawalData.updated_at,
                currency
            }

            if (process.env.ENV !== 'development') {
                // send email to admin
                const text = `
                    <div> Your Withdrawal Request was Confirmed </div>
                    <br />
                    <div> Amount: ${obj.amount} ${currency} </div>
                    <br />
                    <div> Wallet: ${obj.walletAddress} <div/ >
                    <br />
                    <div> Wallet: ${obj.coin} <div/ >
                    <br />
                    <div> Transaction Id: ${obj.id} </div>
                    <br />
                    <div> Date: ${new Date(obj.updatedAt).toLocaleString()} </div>
                    <br />
                    <div>${URL_USER}</div>
                `
                const email_data = {
                    from: `${process.env.NAME}. <${process.env.EMAIL_USER2}>`,
                    to: user.email,
                    subject: 'Withdrawal Transaction',
                    html: text
                }

                mailgunSetup.messages().send(email_data, async (err, resp) => {
                    if (err) {
                        await pool.query('ROLLBACK')

                        if (err.message.includes("ENOTFOUND") || err.message.includes("EREFUSED") || err.message.includes("EHOSTUNREACH")) {
                            return res.status(408).json({ status: false, msg: "No network connectivity" })
                        }
                        else if (err.message.includes("ETIMEDOUT")) {
                            return res.status(408).json({ status: false, msg: "Request Time-out! Check your network connections" })
                        }
                        else {
                            return res.status(500).json({ status: false, msg: err.message });
                        }
                    }
                    else {
                        await pool.query('COMMIT')
                        return res.status(200).json({ status: true, msg: `Transaction confirmed`, data: obj })
                    }
                });
            }
            else {
                await pool.query('COMMIT')
                return res.status(200).json({ status: true, msg: `Transaction confirmed`, data: obj })
            }
        }
        catch (err) {
            await pool.query('ROLLBACK')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllTransactions_admin: async (req, res) => {
        try {
            const { status } = req.query

            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx(status) {
                // get only pending withdrawal hx from the database
                const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE status=$1 ORDER BY updated_at DESC`, [status]);
                const withdrawalHx = withdrawalHxResult.rows;

                // find every users that owns this withdrawal hx
                let usersIdArr = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    usersIdArr.push(withdrawalHx[i].users_id)
                }
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=ANY($1)`, [usersIdArr]);
                let users = userResult.rows;

                let withdrawalHxData = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    users.filter(users => {
                        if (withdrawalHx[i].users_id === users.users_id) {
                            let obj = {
                                _id: withdrawalHx[i]._id,
                                walletAddress: withdrawalHx[i].wallet_address,
                                coin: withdrawalHx[i].coin,
                                amount: withdrawalHx[i].amount,
                                status: withdrawalHx[i].status,
                                transactionType: withdrawalHx[i].transaction_type,
                                createdAt: withdrawalHx[i].created_at,
                                updatedAt: withdrawalHx[i].updated_at,
                                currency,
                                userId: {
                                    _id: users.users_id,
                                    email: users.email,
                                    username: users.username,
                                    role: users.role,
                                }
                            }
                            withdrawalHxData.push(obj)
                        }
                    })
                }
                return withdrawalHxData;
            }

            if (status.toLowerCase() === 'pending') {
                const data = await getHx(status)
                return res.status(200).json({ status: true, msg: "Successful", data })
            }
            else if (status.toLowerCase() === 'rejected') {
                const data = await getHx(status)
                return res.status(200).json({ status: true, msg: "Successful", data })
            }
            else if (status.toLowerCase() === 'confirmed') {
                const data = await getHx(status)
                return res.status(200).json({ status: true, msg: "Successful", data })
            }
            else {
                return res.status(404).json({ status: false, msg: "Not Found!" })
            }

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllTransactions_users: async (req, res) => {
        try {
            const userId = req.user
            // get all withdrawal hx from the database
            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx() {
                // get withdrawal hx from the database
                const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE users_id=$1 ORDER BY created_at DESC`, [userId]);
                const withdrawalHx = withdrawalHxResult.rows;

                // find the user that owns this withdrawal hx
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=$1`, [userId]);
                let users = userResult.rows[0];

                let withdrawalHxData = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    let obj = {
                        _id: withdrawalHx[i]._id,
                        walletAddress: withdrawalHx[i].wallet_address,
                        coin: withdrawalHx[i].coin,
                        amount: withdrawalHx[i].amount,
                        status: withdrawalHx[i].status,
                        transactionType: withdrawalHx[i].transaction_type,
                        createdAt: withdrawalHx[i].created_at,
                        updatedAt: withdrawalHx[i].updated_at,
                        currency,
                        userId: {
                            _id: users.users_id,
                            email: users.email,
                            username: users.username,
                            role: users.role,
                        }
                    }
                    withdrawalHxData.push(obj)
                }
                return withdrawalHxData;
            }

            const withdrawalData = await getHx()

            return res.status(200).json({ status: true, msg: "Successful", data: withdrawalData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    getTransaction: async (req, res) => {
        try {

            const { id } = req.params
            const userId = req.user

            // get all withdrawal hx from the database
            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx() {
                // get withdrawal hx from the database
                const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE users_id=$1 AND _id=$2 ORDER BY created_at DESC`, [userId, id]);
                const withdrawalHx = withdrawalHxResult.rows[0];

                if (!withdrawalHx) {
                    return res.status(400).json({ status: false, msg: "Transaction not found" })
                }
                else {
                    // find the user that owns this withdrawal hx
                    const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=$1`, [userId]);
                    let users = userResult.rows[0];
                    let withdrawalHxData = {
                        _id: withdrawalHx._id,
                        walletAddress: withdrawalHx.wallet_address,
                        coin: withdrawalHx.coin,
                        amount: withdrawalHx.amount,
                        status: withdrawalHx.status,
                        transactionType: withdrawalHx.transaction_type,
                        createdAt: withdrawalHx.created_at,
                        updatedAt: withdrawalHx.updated_at,
                        currency,
                        userId: {
                            _id: users.users_id,
                            email: users.email,
                            username: users.username,
                            role: users.role,
                        }
                    }
                    return withdrawalHxData;
                }
            }

            const withdrawalData = await getHx()


            return res.status(200).json({ status: true, msg: "success", data: withdrawalData })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // 10 most recent confirmed withdrawal hx
    latest: async (req, res) => {
        try {
            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            async function getHx(status) {
                // get withdrawal hx from the database
                const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal ORDER BY updated_at DESC LIMIT 10`);
                const withdrawalHx = withdrawalHxResult.rows;

                // find every users that owns this withdrawal hx
                let usersIdArr = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    usersIdArr.push(withdrawalHx[i].users_id)
                }
                const userResult = await pool.query(`SELECT users_id, email, username, role FROM users WHERE users_id=ANY($1)`, [usersIdArr]);
                let users = userResult.rows;

                let withdrawalHxData = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    users.filter(users => {
                        if (withdrawalHx[i].users_id === users.users_id) {
                            let obj = {
                                _id: withdrawalHx[i]._id,
                                walletAddress: withdrawalHx[i].wallet_address,
                                coin: withdrawalHx[i].coin,
                                amount: withdrawalHx[i].amount,
                                status: withdrawalHx[i].status,
                                transactionType: withdrawalHx[i].transaction_type,
                                createdAt: withdrawalHx[i].created_at,
                                updatedAt: withdrawalHx[i].updated_at,
                                currency,
                                userId: {
                                    _id: users.users_id,
                                    email: users.email,
                                    username: users.username,
                                    role: users.role,
                                }
                            }
                            withdrawalHxData.push(obj)
                        }
                    })
                }
                return withdrawalHxData;
            }

            const data = await getHx();

            return res.status(200).json({ status: true, msg: 'successful', data })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}