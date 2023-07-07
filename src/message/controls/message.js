require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const mailgunSetup = require('../../config/mailgun');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

module.exports = {

    sendAdmin: async (req, res) => {
        try {
            const data = {
                email: DOMPurify.sanitize(req.body.email),
                subject: DOMPurify.sanitize(req.body.subject),
                message: DOMPurify.sanitize(req.body.message),
            }

            const { email, subject, message } = data
            if (!email || !subject || !message) {
                return res.status(400).json({ status: false, msg: "All fields are required!" })
            }

            // validate email
            function checkEmail(email) {

                var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                return filter.test(email) ? true : false
            }

            if (!checkEmail(email)) {
                return res.status(405).json({ status: false, msg: "Invalid email!" });
            }

            const email_data = {
                from: email,
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
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}