require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const pool = require("../../db/conn")

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

const payusers = {
    payusers: async (req, res) => {
        try {
            const { id } = req.params

            // const currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            // sanitize all elements from the client, incase of fodgery
            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
                action: DOMPurify.sanitize(req.body.action),
            }

            const { amount, action } = data;

            if (!amount || !action) {
                return res.status(401).json({ status: false, msg: "All fields are required" })
            }
            else {
                // find user
                const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [id])
                const user = userResult.rows[0]
                if (!user) {
                    return res.status(401).json({ status: false, msg: "User Not Found" })
                }
                else {

                    if (action === 'remove') {
                        if (user.amount < amount) {
                            return res.status(401).json({ status: false, msg: 'Insufficient Balance' })
                        }
                        else {
                            const newAmount = (user.amount - Number(amount)).toFixed(8)
                            const newDataResult = await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2 RETURNING *`, [newAmount, id])
                            const newData = newDataResult.rows[0]

                            return res.status(200).json({ status: true, msg: `${amount} ${currency} has been removed from ${newData.username}'s account. Current Balanece is now ${newData.amount} ${currency}`, data: newData })
                        }
                    }
                    else if (action === 'add') {
                        const newAmount = (user.amount + Number(amount)).toFixed(8)
                        const newDataResult = await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2 RETURNING *`, [newAmount, id])
                        const newData = newDataResult.rows[0]

                        return res.status(200).json({ status: true, msg: `${amount} ${currency} has been added to ${newData.username}'s account. Current Balanece is now ${newData.amount} ${currency}`, data: newData })
                    }
                    else {
                        return res.status(401).json({ status: false, msg: 'No operation action is specified' })
                    }
                }
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    }
}

module.exports = payusers
