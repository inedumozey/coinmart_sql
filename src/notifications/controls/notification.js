require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const pool = require('../../db/conn');
const ran = require('../../auth/utils/randomString')

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)


module.exports = {

    push: async (req, res) => {
        try {
            await pool.query('BEGIN')
            const data = {
                subject: DOMPurify.sanitize(req.body.subject),
                text: DOMPurify.sanitize(req.body.text)
            }

            if (!data.text || !data.subject) {
                return res.status(400).json({ status: false, msg: "All fields are required!" });
            }

            const newNotificationData = await pool.query(`INSERT INTO
                notifications(
                        _id,
                        subject,
                        text
                    )
                    VALUES($1, $2, $3)
                    RETURNING *`,
                [
                    ran.uuid(),
                    data.subject,
                    data.text,
                ]
            )

            const newNotification = newNotificationData.rows[0]

            await pool.query(`UPDATE users SET new_notifications=ARRAY_APPEND(new_notifications, $1)`, [newNotification._id]);
            await pool.query('COMMIT')

            return res.status(200).json({ status: true, msg: "Notification pushed successfully" });
        }
        catch (err) {
            await pool.query('REVOKE')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAll_Admin: async (req, res) => {

        try {
            const notificationData = await pool.query(`SELECT * FROM notifications ORDER BY created_at DESC`)
            const data = notificationData.rows;

            return res.status(200).json({ status: true, msg: "Successful", data });
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getOne_Admin: async (req, res) => {
        try {
            const notificationData = await pool.query(`SELECT * FROM notifications WHERE _id=$1 ORDER BY created_at DESC`, [req.params.id])
            const data = notificationData.rows[0];

            return res.status(200).json({ status: true, msg: "Successful", data });
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // user read
    read: async (req, res) => {
        try {
            const userId = req.user;
            const { id } = req.params

            // update the the user
            await pool.query(`UPDATE users SET new_notifications=ARRAY_REMOVE(new_notifications, $1) WHERE users_id=$2`, [id, userId]);

            await pool.query(`UPDATE users SET read_notifications=ARRAY_APPEND(read_notifications, $1) WHERE users_id=$2`, [id, userId]);

            return res.status(200).json({ status: true, msg: "Message updated", data: id });
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // user delete notification
    deleteNotification: async (req, res) => {
        try {
            const userId = req.user;
            const { id } = req.params

            // update the the user
            await pool.query(`UPDATE users SET
                new_notifications=ARRAY_REMOVE(new_notifications, $1),
                read_notifications=ARRAY_REMOVE(read_notifications, $1)
                WHERE users_id=$2`,
                [
                    id,
                    userId
                ]
            );

            return res.status(200).json({ status: true, msg: "Deleted", data: id });
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}