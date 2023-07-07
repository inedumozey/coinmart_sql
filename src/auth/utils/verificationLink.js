require('dotenv').config();
const mailgunSetup = require('../../config/mailgun');
const text = require('./text')
const pool = require('../../db/conn')
const ran = require('../../auth/utils/randomString')

module.exports = async (user, res, refcode, type) => {

    // get all config
    let configResult = await pool.query("SELECT * FROM config")
    let config = configResult.rows;
    const startContestReg = config && config[0].start_contest_reg;

    const configData = {
        name: process.env.NAME,
        bio: process.env.BIO,
        bg: process.env.BRAND_COLOR,
    }

    const URL = `${process.env.FRONTEND_BASE_URL}/${process.env.VERIFY_EMAIL_URL}/${user.verify_email_token}`

    async function resolveIfRefcode(token, msg) {
        // add referral user
        if (refcode) {
            // get all config
            let userResult = await pool.query("SELECT users_id, username FROM users WHERE referral_code=$1", [refcode])
            let referringUser = userResult.rows[0];

            if (referringUser) {

                // add user as referree to the referral-history
                // create a referral-history for the referrer (the user referring this current user), add the referree id and username
                await pool.query(`INSERT INTO
                    referralhistory (
                        _id,
                        referrer_id,
                        referree_id,
                        referree_username
                    )
                    VALUES($1, $2, $3, $4)`,
                    [
                        ran.uuid(),
                        referringUser.users_id,
                        user.users_id,
                        user.username
                    ]
                )

                // update the current user with his/her referrer username
                let updatedUser = await pool.query(`UPDATE users SET referrer_username=$1, referrer_id=$2 WHERE users_id=$3 RETURNING *`, [referringUser.username, referringUser.users_id, user.users_id]);
                user = updatedUser.rows[0]

                await pool.query(`UPDATE users SET referree_id=ARRAY_APPEND(referree_id, $1) WHERE users_id=$2`, [user.users_id, referringUser.users_id]);

                // instantiate Contest Database with the referrer user
                // Only save user to contest if not in before
                const referralcontestResult = await pool.query(`SELECT * FROM referralcontest WHERE users_id=$1`, [referringUser.users_id]);
                const referralcontestUser = referralcontestResult.rows[0];

                if (!referralcontestUser && startContestReg) {
                    await pool.query(`INSERT INTO 
                        referralcontest (
                            _id,
                            users_id
                        )
                        VALUES($1, $2)`,
                        [
                            ran.uuid(),
                            referringUser.users_id
                        ]
                    )
                }
            }
        }

        await pool.query("COMMIT");
        return res.status(200).json({
            status: true,
            msg,
            token
        })
    }

    if (process.env.ENV !== 'development') {

        const email_data = {
            from: `${configData.name}. <${process.env.EMAIL_USER2}>`,
            to: user.email,
            subject: 'Verify Your Email',
            html: text.linkText(configData.name, configData.bio, configData.bg, URL, user, 'verify-email', "Click to Activate your Account")
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

                if (type !== 'resen-link') {
                    resolveIfRefcode(user.verify_email_token, `Registration successful, check your email ${(user.email)} to verify your account`, '')
                }

                else {
                    return res.status(200).json({
                        status: true,
                        msg: `Link sent successfully, check your email ${(user.email)} to verify your account`,
                        token: ''
                    })
                }
            }
        })

    } else {

        if (type !== 'resen-link') {
            resolveIfRefcode(user.verify_email_token, `Link sent successfully on development mode, Please check below to verify your account`)
        }
        else {
            return res.status(200).json({
                status: true,
                msg: `Link sent successfully on development mode, Please check below to verify your account`,
                token: user.verify_email_token
            })
        }
    }
}


