require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const pool = require('../../db/conn')
const ran = require('../../auth/utils/randomString')

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const mailgunSetup = require('../../config/mailgun');


module.exports = {

    verifyAccountNo: async (req, res) => {
        try {
            const userId = req.user

            // const currency from config
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            // sanitize all elements from the client, incase of fodgery
            const data = {
                accountNumber: DOMPurify.sanitize(req.body.accountNumber),
            }

            // get currency, maxWithdrawalLimit, minWithdrawalLimit, withdrawalCommomDifference and allowTransfer from config data if exist otherwise set to the one in env

            const allowTransfer = config && config[0].allow_transfer

            if (!allowTransfer) {
                return res.status(402).json({ status: false, msg: "Currenctly not available, please try again later later" })
            }

            if (!data.accountNumber) {
                return res.status(400).json({ status: false, msg: "Account number is required" })
            }

            // get sender's total amount
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]
            if (!user) {
                return res.status(500).json({ status: false, msg: "User not found!" })
            }

            // get the receiver using the account number
            const rUserResult = await pool.query(`SELECT * FROM users WHERE account_number=$1`, [data.accountNumber])
            const rUser = rUserResult.rows[0]

            // validate the account number
            if (!rUser) {
                return res.status(400).json({ status: false, msg: "Invalid account number" })
            };

            // check to be sure account number does not belongs to the sender
            if (rUser.accountNumber === user.account_number) {
                return res.status(400).json({ status: false, msg: "Owner's account number" })
            }

            const info = {
                username: rUser.username,
                email: rUser.email,
                accountNumber: rUser.account_number,
            }

            // send confirmation msg to the sender
            return res.status(200).json({ status: true, msg: "Valid Account Number", data: { ...info } })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    payUser: async (req, res) => {
        try {
            pool.query('BEGIN')
            const userId = req.user

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows
            let { currency } = configResult.rows[0]

            // sanitize all elements from the client, incase of fodgery
            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
                accountNumber: DOMPurify.sanitize(req.body.accountNumber),
            }

            if (!data.amount || !data.accountNumber) {
                return res.status(400).json({ status: false, msg: "All fields are required" })
            }

            // check transfer factors
            const allowTransfer = config && config[0].allow_transfer
            const transferableFactors = config && config[0].transferable_factors

            if (!allowTransfer) {
                return res.status(402).json({ status: false, msg: "Currenctly not available, please try again later later" })
            }

            // check for transfer factors
            // if transferFactors is 1, users can transfer any amount otherwise, users can only transfer amount in the transferFactors array
            if (transferableFactors.length !== 1 && transferableFactors[0] !== 1) {
                if (!transferableFactors.includes(data.amount)) {
                    return res.status(400).json({ status: false, msg: "Invalid amount" });
                }
            }

            // get sender's total amount
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]
            if (!user) {
                return res.status(400).json({ status: false, msg: "User not found!" })
            }

            // check sender's amount, if less than what he is transfering, send error
            if (Number(data.amount) > Number(user.amount)) {
                return res.status(400).json({ status: false, msg: "Insufficient balance" })
            }

            const rUserResult = await pool.query(`SELECT * FROM users WHERE account_number=$1`, [data.accountNumber])
            const rUser = rUserResult.rows[0]

            // validate the account number
            if (!rUser) {
                return res.status(400).json({ status: false, msg: "Invalid account number" })
            };

            // check to be sure account number does not belongs to the sender
            if (rUser.accountNumber === user.account_number) {
                return res.status(400).json({ status: false, msg: "Owner's account number" })
            }

            //.........................................................

            // handle transactions
            // 1. add the amount to the receiver's account
            const newAmount_receiver = (rUser.amount + data.amount).toFixed(8)
            await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [newAmount_receiver, rUser.users_id])

            // 2. remove the amount from sender's account
            const newAmount_sender = (user.amount - data.amount).toFixed(8)
            await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [newAmount_sender, userId])

            // 3 save the data into in internal transfer database (transaction) of the sender  
            const newInternalTransferResult = await pool.query(`INSERT INTO
            Internaltransfer(
                _id,
                sender_id,
                sender_username,
                receiver_id,
                receiver_username,
                account_number,
                amount
            )
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
                [
                    ran.uuid(),
                    userId,
                    user.username,
                    rUser.users_id,
                    rUser.username,
                    data.accountNumber,
                    data.amount.toFixed(8)
                ]

            )
            const newInternalTransfer = newInternalTransferResult.rows[0]

            // send email to sender
            const text_sender = `
                <div> You transfered ${data.amount.toFixed(4)} ${currency} to ${rUser.username} </div>
                <br />
                <div> If this is not made by you, please contact the admin </div>
            `
            const email_sender_data = {
                from: `${process.env.NAME}. <${process.env.EMAIL_USER2}>`,
                to: user.email,
                subject: 'Transfer Transaction',
                html: text_sender
            }

            // send email to receiver
            const text_receiver = `
                <div> The sum of ${data.amount.toFixed(4)} ${currency} was transfered to you from ${user.username} </div>
            `
            const email_receiver_data = {
                from: `${process.env.NAME}. <${process.env.EMAIL_USER2}>`,
                to: rUser.email,
                subject: 'Transfer Transaction',
                html: text_receiver
            }

            if (process.env.ENV !== 'development') {
                mailgunSetup.messages().send(email_sender_data, async (err, resp) => {
                    if (err) {
                        if (err.message.includes("ENOTFOUND") || err.message.includes("EREFUSED") || err.message.includes("EHOSTUNREACH")) {
                            return res.status(408).json({ status: false, msg: "No network connectivity" })
                        }
                        else if (err.message.includes("ETIMEDOUT")) {
                            return res.status(408).json({ status: false, msg: "Request Time-out! Check your network connections" })
                        }
                        else {
                            return res.status(500).json({ status: false, msg: err.message })
                        }
                    }
                    else {

                        mailgunSetup.messages().send(email_receiver_data, async (err, resp) => {
                            if (err) {
                                if (err.message.includes("ENOTFOUND") || err.message.includes("EREFUSED") || err.message.includes("EHOSTUNREACH")) {
                                    return res.status(408).json({ status: false, msg: "No network connectivity" })
                                }
                                else if (err.message.includes("ETIMEDOUT")) {
                                    return res.status(408).json({ status: false, msg: "Request Time-out! Check your network connections" })
                                }
                                else {
                                    return res.status(500).json({ status: false, msg: err.message })
                                }
                            }
                            else {
                                pool.query('COMMIT')

                                return res.status(200).json({ status: true, msg: `Transaction successful`, data: newInternalTransfer })
                            }
                        })
                    }
                })
            }
            else {
                pool.query('COMMIT')

                return res.status(200).json({ status: true, msg: `Transaction successful`, data: newInternalTransfer })
            }

        }
        catch (err) {
            pool.query('ROLLBACK')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // getAllTransactions_admin: async (req, res) => {
    //     try {

    //         const data = await InternalTransfer.findOne().populate({ path: 'senderId', select: ['_id', 'username', 'email'] }).populate({ path: 'receiverId', select: ['_id', 'username', 'email'] }).sort({ createdAt: -1 });

    //         return res.status(200).send({ status: true, msg: 'Successful', data })

    //     }
    //     catch (err) {
    //         return res.status(500).json({ status: false, msg: err.messsage || "Server error, please contact customer support" })
    //     }
    // },

    // getAllTransactions: async (req, res) => {
    //     try {
    //         const userId = req.user;

    //         const data = await InternalTransfer.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).populate({ path: 'senderId', select: ['_id', 'username', 'accountNumber', 'email'] }).populate({ path: 'receiverId', select: ['_id', 'username', 'accountNumber', 'email'] }).sort({ createdAt: -1 });

    //         return res.status(200).send({ status: true, msg: 'Successful', data })

    //     }
    //     catch (err) {
    //         return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
    //     }
    // },

    // getTransaction: async (req, res) => {
    //     try {
    //         const userId = req.user;
    //         const { id } = req.params;

    //         // get the transaction hx
    //         const data = await InternalTransfer.findOne({ $and: [{ _id: id }, { $or: [{ senderId: userId }, { receiverId: userId }] }] });

    //         if (!data) {
    //             return res.status(400).json({ status: false, msg: "Transaction not found" })
    //         }

    //         return res.status(200).send({ status: true, msg: 'Successful', data })
    //     }
    //     catch (err) {
    //         return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
    //     }
    // },

    // getTransaction_admin: async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         // get the transaction hx
    //         const data = await InternalTransfer.findOne({ _id: id });

    //         if (!data) {
    //             return res.status(400).json({ status: false, msg: "Transaction not found" })
    //         }

    //         return res.status(200).send({ status: true, msg: 'Successful', data })
    //     }
    //     catch (err) {
    //         return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
    //     }
    // }
}