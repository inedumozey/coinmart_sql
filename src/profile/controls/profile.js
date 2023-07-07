require("dotenv").config();
const mailgunSetup = require('../../config/mailgun');

const multerConfig = require("../../config/multer");
const path = require("path")
const fs = require("fs")
const cloudinary = require("../../config/cloudinary");

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const pool = require("../../db/conn")

module.exports = {
    updateProfileImage: async (req, res) => {
        try {
            // image
            await pool.query('BEGIN')
            const { upload, multer } = multerConfig();
            const userId = req.user;
            // find the profile id from User collection
            const userResult = await pool.query("SELECT * FROM users WHERE users_id=$1", [userId])
            const user = userResult.rows[0];

            const profile = user;

            let imageFileType = /png|jpg|jpeg/

            upload.single('file')(req, res, async (err) => {
                try {
                    if (!req.file) {
                        return res.status(402).json({ status: false, msg: "Empty file" })
                    }

                    const extType = path.extname(req.file.originalname)
                    const mimeType = req.file.mimetype

                    const isImage = imageFileType.test(extType) || imageFileType.test(mimeType)

                    if (!isImage) {
                        return res.status(402).json({ status: false, msg: "Supported files are PNG, JPG and JPEG" })

                    } else if (err instanceof multer.MulterError) {
                        return res.status(402).json({ status: false, msg: err.message })

                    } else if (err) {
                        return res.status(402).json({ status: false, msg: err.message })

                    } else {

                        const filePath = req.file.path

                        // get the name of the app and use it as media folder on cloudinary
                        const appName = process.env.NAME;

                        // update profile pic on cloudinary
                        //1. delete the file from cloudinary using the public id if it exist
                        profile.profile_pic_public_id ? await cloudinary.v2.uploader.destroy(profile.profile_pic_public_id, { invalidate: true }) : "";

                        // 2. upload the new file
                        const result = await cloudinary.v2.uploader.upload(filePath, {
                            folder: `${appName}/profile`,
                            eager: [
                                { width: 300, height: 300, crop: 'pad' }
                            ]
                        })

                        // update Profile database with the secure_url from cloudinary
                        await pool.query(`UPDATE users SET 
                            profile_pic_url=$1,
                            profile_pic_public_id=$2
                            WHERE users_id=$3`,
                            [
                                result.eager[0].secure_url,
                                result.public_id,
                                profile.users_id
                            ]
                        )

                        // remove the file path
                        fs.unlinkSync(filePath)

                        return res.status(200).json({ status: true, msg: "Successful" })
                    }
                }
                catch (err) {
                    return res.status(500).json({ status: false, msg: err.message || 'Error occured! try again' })
                }
            })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user;
            const data = {
                country: DOMPurify.sanitize(req.body.country),
                phone: DOMPurify.sanitize(req.body.phone),
                address: DOMPurify.sanitize(req.body.address),
            }
            const userData = await pool.query(`SELECT phone, address, country FROM users WHERE users_id=$1`, [userId])

            const profile = userData.rows[0]

            // find the users_id from User table and update
            await pool.query(`UPDATE users SET
                country=$1,
                phone=$2,
                address=$3
                WHERE users_id=$4`,
                [
                    !data.country ? profile.country : data.country,
                    !data.phone ? profile.phone : data.phone,
                    !data.address ? profile.address : data.address,
                    userId
                ]
            )
            return res.status(200).json({ status: false, msg: "Profile updated" })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    // pending
    update2fa: async (req, res) => {
        try {


        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    contactAdmin: async (req, res) => {
        try {
            const userId = req.user;
            // find the profile id from User collection
            const userData = await pool.query(`SELECT email FROM users WHERE users_id=$1`, [userId])
            const user = userData.rows[0]

            const data = {
                subject: DOMPurify.sanitize(req.body.subject),
                message: DOMPurify.sanitize(req.body.message),
            }

            const { subject, message } = data
            if (!subject || !message) {
                return res.status(400).json({ status: false, msg: "All fields are required!" })
            }

            if (!user.email) {
                return res.status(400).json({ status: true, msg: "User not foubd!" })
            }

            const email_data = {
                from: user.email,
                to: [process.env.EMAIL_USER],
                subject: subject,
                html: `<p>${message}</p>`
            }

            mailgunSetup.messages().send(email_data, async (err, resp) => {
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
                    return res.status(200).json({ status: true, msg: "Your message has be sent successfully" })
                }
            })
        }
        catch (err) {
            console.log({ err: err.message })
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}
