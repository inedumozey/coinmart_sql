const cloudinary = require("../../config/cloudinary");
require("dotenv").config();
const pool = require('../../db/conn')
const bcrypt = require("bcrypt");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const jwt = require("jsonwebtoken");
const verificationLink = require('../utils/verificationLink');
const passResetLink = require('../utils/passResetLink');
const ran = require('../utils/randomString')
const { generateAccesstoken, generateRefreshtoken } = require('../utils/generateTokens')

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

const removeExpiredPasswordToken = async () => {
    try {
        let rows1 = await pool.query(`SELECT * FROM passwordtoken`)
        const data = rows1.rows

        const expiredIn = new Date(Date.now()) - (1000 * 60 * 1) // 24 hours in ms
        // const expiredIn = new Date(Date.now()) - (1000 * 60 * 60 * 24) // 24 hours in ms

        let matchedArr = []
        for (let i = 0; i < data.length; i++) {
            const date = data[i].updated_at;
            if (date < expiredIn) {
                matchedArr.push(data[i]._id)
            }
        }
        await pool.query(`DELETE FROM passwordtoken WHERE _id = ANY($1)`, [[matchedArr]]);
        return;
    }
    catch (err) {
        return;
    }
}

module.exports = {

    getUsers: async (req, res) => {
        try {
            // const currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            const { rows } = await pool.query(`SELECT * FROM users ORDER BY created_at DESC`);
            let data = rows;

            let dataArr = []
            for (let i = 0; i < data.length; i++) {
                // send the user
                data[i].password = null;

                let obj = {
                    _id: data[i].users_id,
                    username: data[i].username,
                    email: data[i].email,
                    amount: data[i].amount,
                    currency: currency,
                    accountNumber: data[i].account_number,
                    role: data[i].role,
                    isSupperAdmin: data[i].is_supper_admin,
                    verifyEmailToken: data[i].verify_email_token,
                    isVerified: data[i].is_verified,
                    isBlocked: data[i].is_blocked,
                    hasInvested: data[i].has_invested,
                    investmentCount: data[i].investment_count,
                    referralContestRewards: data[i].referral_contest_rewards,
                    referralCode: data[i].referral_code,
                    referreeId: data[i].referree_id,
                    referrerId: data[i].referrer_id,
                    referrerUsername: data[i].referrer_username,
                    newNotifications: data[i].new_notifications,
                    readNotifications: data[i].read_notifications,
                    profilePicUrl: data[i].profile_pic_url,
                    profilePicPublicId: data[i].profile_pic_public_id,
                    twofa: data[i].twofa,
                    phone: data[i].phone,
                    country: data[i].country,
                    address: data[i].address,
                    createdAt: data[i].created_at,
                    updatedAt: data[i].updated_at,
                }

                dataArr.push(obj)
            }
            data = dataArr;

            return res.status(200).json({ status: true, msg: "successfull", data })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getUser: async (req, res) => {
        try {
            const { id } = req.params;
            // const currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            const { rows } = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [id]);
            let data = rows[0];

            if (!data) res.status(404).json({ status: false, msg: `User not found!` })
            else {
                // get the referrer
                let referrerResults = await pool.query(`SELECT * FROM users WHERE users_id = ANY($1)`, [data.referrer_id]);
                let referrerUsers = referrerResults.rows[0]
                referrerUsers = !referrerUsers ? null : {
                    _id: referrerUsers.users_id,
                    email: referrerUsers.email,
                    username: referrerUsers.username,
                    hasInvested: referrerUsers.has_invested
                }

                // get the referrees
                let referreeUsersArr = []
                let referreeResults = await pool.query(`SELECT * FROM users WHERE users_id=ANY($1)`, [data.referree_id]);
                let referreeUsers = referreeResults.rows
                for (let i = 0; i < referreeUsers.length; i++) {
                    const obj = {
                        _id: referreeUsers[i].users_id,
                        email: referreeUsers[i].email,
                        username: referreeUsers[i].username,
                        hasInvested: referreeUsers[i].has_invested
                    }
                    referreeUsersArr.push(obj)
                }

                // get all new notifications
                let newNotificationsArr = []
                let newNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [data.new_notifications]);
                let newNotifications = newNotificationsResults.rows
                for (let i = 0; i < newNotifications.length; i++) {
                    const obj = {
                        _id: newNotifications[i]._id,
                        subject: newNotifications[i].subject,
                        text: newNotifications[i].text,
                        createdAt: newNotifications[i].created_at,
                        updatedAt: newNotifications[i].updated_at
                    }
                    newNotificationsArr.push(obj)
                }

                // get all read notifications
                let readNotificationsArr = []
                let readNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [data.read_notifications]);
                let readNotifications = readNotificationsResults.rows
                for (let i = 0; i < readNotifications.length; i++) {
                    const obj = {
                        _id: readNotifications[i]._id,
                        subject: readNotifications[i].subject,
                        text: readNotifications[i].text,
                        createdAt: readNotifications[i].created_at,
                        updatedAt: readNotifications[i].updated_at
                    }
                    readNotificationsArr.push(obj)
                }

                // send the user 
                data.referree_id = referreeUsersArr;
                data.referrer_id = referrerUsers;
                data.newNotifications = newNotificationsArr;
                data.readNotifications = readNotificationsArr;
                data.password = null;

                let obj = {
                    _id: data.users_id,
                    username: data.username,
                    email: data.email,
                    amount: data.amount,
                    currency,
                    accountNumber: data.account_number,
                    role: data.role,
                    isSupperAdmin: data.is_supper_admin,
                    verifyEmailToken: data.verify_email_token,
                    isVerified: data.is_verified,
                    isBlocked: data.is_blocked,
                    hasInvested: data.has_invested,
                    investmentCount: data.investment_count,
                    referralContestRewards: data.referral_contest_rewards,
                    referralCode: data.referral_code,
                    referreeId: data.referree_id,
                    referrerId: data.referrer_id,
                    referrerUsername: data.referrer_username,
                    newNotifications: data.newNotifications,
                    readNotifications: data.readNotifications,
                    profilePicUrl: data.profile_pic_url,
                    profilePicPublicId: data.profile_pic_public_id,
                    twofa: data.twofa,
                    phone: data.phone,
                    country: data.country,
                    address: data.address,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                }
                data = obj;
                return res.status(200).json({ status: true, msg: 'User Fetched Successfully', data });
            }
        }

        catch (err) {
            res.status(500).send({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.user;

            // get currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            const { rows } = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId]);
            let data = rows[0];

            if (!data) res.status(404).json({ status: false, msg: `User not found!` });


            else {
                // get the referrer
                let referrerResults = await pool.query(`SELECT * FROM users WHERE users_id = $1`, [data.referrer_id]);
                let referrerUsers = referrerResults.rows[0]
                referrerUsers = !referrerUsers ? null : {
                    _id: referrerUsers.users_id,
                    email: referrerUsers.email,
                    username: referrerUsers.username,
                    hasInvested: referrerUsers.has_invested
                }

                // get the referrees

                let referreeUsersArr = []
                let referreeResults = await pool.query(`SELECT * FROM users WHERE users_id =ANY($1)`, [data.referree_id]);
                let referreeUsers = referreeResults.rows
                for (let i = 0; i < referreeUsers.length; i++) {
                    const obj = {
                        _id: referreeUsers[i].users_id,
                        email: referreeUsers[i].email,
                        username: referreeUsers[i].username,
                        hasInvested: referreeUsers[i].has_invested
                    }
                    referreeUsersArr.push(obj)
                }

                // get all new notifications
                let newNotificationsArr = []
                let newNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [data.new_notifications]);
                let newNotifications = newNotificationsResults.rows
                for (let i = 0; i < newNotifications.length; i++) {
                    const obj = {
                        _id: newNotifications[i]._id,
                        subject: newNotifications[i].subject,
                        text: newNotifications[i].text,
                        createdAt: newNotifications[i].created_at,
                        updatedAt: newNotifications[i].updated_at
                    }
                    newNotificationsArr.push(obj)
                }

                // get all read notifications
                let readNotificationsArr = []
                let readNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [data.read_notifications]);
                let readNotifications = readNotificationsResults.rows
                for (let i = 0; i < readNotifications.length; i++) {
                    const obj = {
                        _id: readNotifications[i]._id,
                        subject: readNotifications[i].subject,
                        text: readNotifications[i].text,
                        createdAt: readNotifications[i].created_at,
                        updatedAt: readNotifications[i].updated_at
                    }
                    readNotificationsArr.push(obj)
                }

                // send the user 
                data.referree_id = referreeUsersArr;
                data.referrer_id = referrerUsers;
                data.newNotifications = newNotificationsArr;
                data.readNotifications = readNotificationsArr;
                data.password = null;

                let obj = {
                    _id: data.users_id,
                    username: data.username,
                    email: data.email,
                    amount: data.amount,
                    currency,
                    accountNumber: data.account_number,
                    role: data.role,
                    isSupperAdmin: data.is_supper_admin,
                    verifyEmailToken: data.verify_email_token,
                    isVerified: data.is_verified,
                    isBlocked: data.is_blocked,
                    hasInvested: data.has_invested,
                    investmentCount: data.investment_count,
                    referralContestRewards: data.referral_contest_rewards,
                    referralCode: data.referral_code,
                    referreeId: data.referree_id,
                    referrerId: data.referrer_id,
                    referrerUsername: data.referrer_username,
                    newNotifications: data.newNotifications,
                    readNotifications: data.readNotifications,
                    profilePicUrl: data.profile_pic_url,
                    profilePicPublicId: data.profile_pic_public_id,
                    twofa: data.twofa,
                    phone: data.phone,
                    country: data.country,
                    address: data.address,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                }
                data = obj;
                return res.status(200).json({ status: true, msg: 'Profile Fetched Successfully', data });
            }
        }

        catch (err) {
            console.log(err.message)
            res.status(500).send({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    signup: async (req, res) => {
        await pool.query("BEGIN");
        try {

            // sanitize all elements from the client, incase of fodgery
            const refcode = DOMPurify.sanitize(req.query.refcode);

            const data = {
                password: DOMPurify.sanitize(req.body.password),
                cpassword: DOMPurify.sanitize(req.body.cpassword),
                username: DOMPurify.sanitize(req.body.username),
                email: DOMPurify.sanitize(req.body.email),
                country: DOMPurify.sanitize(req.body.country),
                phone: DOMPurify.sanitize(req.body.phone),
                address: DOMPurify.sanitize(req.body.address),
            }

            const { email, username, password, cpassword, country, phone, address } = data;
            const addressLength = 250;

            function checkEmail(email) {

                var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                return filter.test(email) ? true : false
            }

            if (!email || !password || !username || !country || !address) {
                return res.status(400).json({ status: false, msg: "All fields are required!" });
            }

            else if (address.length > addressLength) {
                return res.status(400).json({ status: false, msg: `Address too long! must not be more than ${addressLength} characters` });
            }

            else if (username.length < 4) {
                return res.status(405).json({ status: false, msg: "Username too short, must not be less than 4 characters" });
            }

            else if (password.length < 6) {
                return res.status(405).json({ status: false, msg: "Password too short, must not be less than 6 characters" });
            }

            else if (password !== cpassword) {
                return res.status(405).json({ status: false, msg: "Passwords do not match!" });

            }

            else if (!checkEmail(email)) {
                return res.status(405).json({ status: false, msg: "Email is invalid!" });
            }

            // check for already existing email and usernameconst 
            const emailRow = await pool.query(`SELECT email FROM users WHERE email=$1`, [email]);
            const usernameRow = await pool.query(`SELECT username FROM users WHERE username=$1`, [username]);

            const oldUser = emailRow.rows
            const oldUsername = usernameRow.rows

            if (oldUser.length) {
                return res.status(409).json({ status: false, msg: "Email already exist!" });
            }

            if (oldUsername.length) {
                return res.status(409).json({ status: false, msg: "Username already taken!" });
            }

            //hash the password
            const hashedPass = await bcrypt.hash(password, 10);

            // // save the user data
            const userDataResult = await pool.query(`INSERT INTO
            users (
                users_id,
                username,
                email,
                password,
                phone,
                country,
                address,
                referral_code,
                account_number,
                verify_email_token
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
                [
                    ran.uuid(),
                    username,
                    email,
                    hashedPass,
                    phone,
                    country,
                    address,
                    ran.referralCode(),
                    ran.acc(),
                    ran.token()
                ]
            )


            const user = userDataResult.rows[0];

            //send account activation link to the user
            verificationLink(user, res, refcode, '', data);
        }
        catch (err) {
            await pool.query("ROLLBACK");
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    resendVerificationLink: async (req, res) => {
        try {
            const email = req.body.email;

            if (!email) {
                return res.status(402).json({ status: false, msg: "User not found" })
            }

            // fetch user
            let userResult = await pool.query(`SELECT * FROM users WHERE email=$1 OR username=$2`, [email, email])
            let user = userResult.rows[0]

            if (!user) {
                return res.status(402).json({ status: false, msg: "User not found" })
            }

            if (user.is_verified) {
                return res.status(402).json({ status: false, msg: "Your account has already been verified" })
            }
            else {
                // send verification link
                verificationLink(user, res, "", 'resen-link', '')
            }
        }
        catch (err) {
            return res.status(505).json({ status: false, msg: err.message || "Internal Server error, please contact customer service" });
        }
    },

    verifyAccount: async (req, res) => {
        try {
            await pool.query('BEGIN')
            const { token } = req.query

            if (!token) {
                return res.status(400).json({ status: false, msg: "Token is missing!" })
            } else {
                //search token in the database
                let userResult = await pool.query(`SELECT * FROM users WHERE verify_email_token=$1`, [token]);
                let user = userResult.rows[0]

                if (!user) {
                    return res.status(400).json({ status: false, msg: "Invalid token" })
                }

                else if (user.is_verified) {
                    return res.status(400).json({ status: false, msg: "Your account has already been verified" })
                }

                else {
                    user.is_verified = true;
                    user.verify_email_token = null;
                    setTimeout(async () => {
                        // update user table
                        await pool.query(`UPDATE users SET is_verified=$1, verify_email_token=$2 WHERE users_id=$3`, [true, null, user.users_id])
                    }, 1000);

                    await pool.query('COMMIT')

                    // log the user in
                    const accesstoken = generateAccesstoken(user.users_id);
                    const refreshtoken = generateRefreshtoken(user.users_id);

                    return res.status(200).json({
                        status: true,
                        msg: "Your account is now activated",
                        accesstoken,
                        refreshtoken,
                        data: user
                    })
                }
            }
        }
        catch (err) {
            await pool.query('ROLLBACK')
            res.status(500).json({ status: false, message: err.message || "Internal Server error, please contact customer support" })
        }
    },

    signin: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: false, msg: "All fields are required!" });

            }
            else {
                // find user with username or email
                let userResult = await pool.query(`SELECT * FROM users WHERE email=$1 OR username=$2`, [email, email])
                let user = userResult.rows[0]

                if (!user) {
                    return res.status(400).json({ status: false, msg: "Invalid login  credentials" });
                }

                // match provided password with the one in database
                const match = await bcrypt.compare(password.toString(), user.password)

                if (!match) {
                    return res.status(400).json({ status: false, msg: "Invalid login credentials" });
                }

                if (!user.is_verified) {
                    return res.status(400).json({ status: false, msg: "Please verify your account to login in" });
                }

                // log the user in
                const accesstoken = generateAccesstoken(user.users_id);
                const refreshtoken = generateRefreshtoken(user.users_id);

                return res.status(200).json({
                    status: true,
                    msg: "Your are logged in",
                    accesstoken,
                    refreshtoken,
                    data: user
                })
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    generateAccesstoken: async (req, res) => {
        try {
            //refresh token passed in req.body from client is used to refresh access token which will then be saved in client token
            const authToken = req.headers["authorization"];

            if (!authToken) {
                return res.status(400).json({ status: false, message: "You are not authorize, please login or register" })
            }

            // Verify token
            const token = authToken.split(" ")[1]

            if (!token) {
                return res.status(400).json({ status: false, msg: "User not authenticated! Please login or register" });
            }

            //validate token
            const data = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            if (!data) {
                return res.status(400).json({ status: false, msg: "Invalid token! Please login or register" });
            }

            // find the user
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [data.id])
            let user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ status: false, msg: "User not found" })
            }

            // generate new accesstoken and refreshtoken and send to the client cookie
            const accesstoken = generateAccesstoken(user.users_id);
            const refreshtoken = generateRefreshtoken(user.users_id);

            return res.status(200).json({
                status: true,
                msg: "Access token refreshed",
                accesstoken,
                refreshtoken,
                data: user
            })
        }
        catch (err) {
            if (err.message == 'invalid signature' || err.message == 'invalid token' || err.message === 'jwt malformed' || err.message === "jwt expired") {
                return res.status(402).json({ status: false, msg: "You are not authorized! Please login or register" })
            }
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    resetPassword: async (req, res) => {
        try {

            const userId = req.user;

            const data = {
                oldPassword: DOMPurify.sanitize(req.body.oldPassword),
                newPassword: DOMPurify.sanitize(req.body.newPassword),
                newCpassword: DOMPurify.sanitize(req.body.newCpassword)
            }

            if (!data.newPassword || !data.newCpassword || !data.oldPassword) {
                return res.status(400).json({ status: false, msg: "All fields are required" });
            }

            //use the id to find the user
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            let user = userResult.rows[0]

            if (!user) {
                return res.status(400).json({ status: false, msg: "User not found" });
            }

            else if (data.newPassword.length < 6) {
                return res.status(405).json({ status: false, msg: "Password too short, must not be less than 6 characters" });
            }

            if (data.newPassword != data.newCpassword) {
                return res.status(405).json({ status: false, msg: "Passwords do not match!" });
            }

            // match provided oldPassword with the one in database
            const match = await bcrypt.compare(data.oldPassword.toString(), user.password)

            if (!match) {
                return res.status(400).json({ status: false, msg: "The old password is invalid" });
            }

            // 2. hash and update user model with the new password
            const hashedPass = await bcrypt.hash(data.newPassword, 10);

            await pool.query(`UPDATE users SET password=$1 WHERE users_id=$2`, [hashedPass, userId])

            return res.status(200).json({ status: true, msg: "Password changed successfully" })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            await pool.query("BEGIN")
            removeExpiredPasswordToken()

            if (!email) {
                return res.status(400).json({ status: false, msg: "The field is required!" });
            }

            // get the user
            let userResult = await pool.query(`SELECT * FROM users WHERE email=$1 OR username=$2`, [email, email])
            let user = userResult.rows[0]

            if (!user) {
                return res.status(400).json({ status: false, msg: "User not found! Please register" });
            }

            // check passwordReset collection if user already exist, then update the token
            // const oldUser = await PasswordReset.findOne({ userId: user._id })
            const oldUserResult = await pool.query(`SELECT * FROM passwordtoken WHERE users_id=$1`, [user.users_id])
            const oldUser = oldUserResult.rows[0]

            if (oldUser) {
                const passwordResetResult = await pool.query(`UPDATE passwordtoken SET 
                    token=$1,
                    updated_at=$2
                    WHERE users_id=$3
                    RETURNING *`,
                    [ran.resetToken(), new Date(), user.users_id]
                );

                const passwordReset = passwordResetResult.rows[0]
                const data = { email: user.email, passwordReset: passwordReset.token }

                passResetLink(data, res);
            }

            else {
                // otherwise generate and save token and also save the user
                const passwordResetResult = await pool.query(`INSERT INTO
                passwordtoken (
                    _id,
                    token,
                    users_id 
                )
                VALUES($1, $2, $3)
                RETURNING *`,
                    [
                        ran.uuid(),
                        ran.resetToken(),
                        user.users_id
                    ]
                )
                const passwordReset = passwordResetResult.rows[0]
                const data = { email: user.email, passwordReset: passwordReset.token }

                passResetLink(data, res);
            }

        }
        catch (err) {
            await pool.query("ROLLBACK")
            return res.status(500).json({ status: false, msg: err });
        }
    },

    verifyForgotPassword: async (req, res) => {
        try {
            const { token } = req.query;
            removeExpiredPasswordToken();

            const data = {
                password: DOMPurify.sanitize(req.body.password),
                cpassword: DOMPurify.sanitize(req.body.cpassword)
            }

            if (!data.password || !data.cpassword) {
                return res.status(400).json({ status: false, msg: "Fill all required fields!" });

            }
            if (data.password != data.cpassword) {
                return res.status(405).json({ status: false, msg: "Passwords do not match!" });
            }

            else if (data.password.length < 6) {
                return res.status(405).json({ status: false, msg: "Password too short, must not be less than 6 characters" });
            }
            if (!token) {
                return res.status(400).json({ status: false, msg: "Token is missing!" })
            }
            else {
                //search token in the database
                const tokenResult = await pool.query(`SELECT * FROM passwordtoken WHERE token=$1`, [token])

                const token_ = tokenResult.rows[0];

                if (!token_) {
                    return res.status(400).json({ status: false, msg: "Invalid token" })
                }
                else {
                    //use the token to find the user
                    let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [token_.users_id])
                    let user = userResult.rows[0]

                    if (!user) {
                        return res.status(400).json({ status: false, msg: "User not found" });
                    }
                    else {
                        // 1. update user model with password
                        const hashedPass = await bcrypt.hash(data.password, 10);

                        userResult = await pool.query(`UPDATE users SET password=$1 WHERE users_id=$2 RETURNING *`, [hashedPass, user.users_id]);
                        user = userResult.rows[0]

                        // 2. remove the token from PasswordReset model
                        await pool.query('DELETE FROM passwordtoken WHERE _id=$1', [token_._id]);

                        // check if user verified his/her account
                        if (!user.is_verified) {
                            return res.status(200).json({
                                status: true,
                                msg: "Password Changed. Please verify your account to login in",
                                data: "",
                                accesstoken: "",
                                refreshtoken: "",
                            });
                        }
                        else {
                            // login the user
                            const accesstoken = generateAccesstoken(user.users_id);
                            const refreshtoken = generateRefreshtoken(user.users_id);

                            return res.status(200).json({
                                status: true,
                                msg: "Password Changed and you are logged in",
                                accesstoken,
                                refreshtoken,
                                data: user
                            })
                        }
                    }
                }

            }

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    toggleAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const loggedId = req.user

            const userData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [id])
            const user = userData.rows[0]

            const loggedUserData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [loggedId])
            const loggedUser = loggedUserData.rows[0];

            if (!user) {
                return res.status(401).json({ status: true, msg: "User not found" });
            }

            if (user.is_blocked) {
                return res.status(401).json({ status: true, msg: "User is blocked" });
            }

            if (!user.is_verified) {
                return res.status(401).json({ status: true, msg: "User's account is not verifeid" });
            }

            if (user.role?.toLowerCase() === "user") {
                // update the user with the phone number
                const data_ = await pool.query(`UPDATE users SET role=$1 WHERE users_id=$2 RETURNING *`, ['ADMIN', id])
                const data = data_.rows[0]

                return res.status(200).json({ status: true, msg: "User is now an Admin", data });
            }
            else {
                if (loggedUser.is_supper_admin && id == loggedId) {
                    return res.status(401).json({ status: false, msg: "Supper admin cannot be removed from the role" });
                }
                // update the user with the phone number
                const data_ = await pool.query(`UPDATE users SET role=$1 WHERE users_id=$2 RETURNING *`, ['USER', id])
                const data = data_.rows[0]

                return res.status(200).json({ status: true, msg: "User is no more an Admin", data });
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    toggleBlockUser: async (req, res) => {
        try {
            let { id } = req.params
            // Find and block user, user most not be the admin
            const userData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [id])
            const user_ = userData.rows[0]

            if (!user_) {
                return res.status(404).json({ status: false, msg: "User not found" })
            }
            if (!user_.is_blocked) {
                if (user_.role?.toLowerCase() === 'admin') {
                    return res.status(400).json({ status: false, msg: "Admin's account cannot be blocked" })

                } else {
                    const data_ = await pool.query(`UPDATE users SET is_blocked=$1 WHERE users_id=$2 RETURNING *`, [true, id])
                    const data = data_.rows[0]

                    return res.status(200).json({ status: true, msg: "User's account has been blocked", data })
                }
            }

            else {
                const data_ = await pool.query(`UPDATE users SET is_blocked=$1 WHERE users_id=$2 RETURNING *`, [false, id])
                const data = data_.rows[0]

                return res.status(200).json({ status: true, msg: "User's account has been unblocked", data });
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }

    },

    deleteManyAccounts: async (req, res) => {
        try {
            await pool.query(`BEGIN`);
            // find these users that are not admin
            const usersData = await pool.query(`SELECT users_id, profile_pic_public_Id FROM users WHERE users_id=ANY($1) AND role=$2`, [req.body.id, 'USER'])
            const users = usersData.rows;

            // loop through and get their ids
            let id = []
            let profileId = []
            for (let user of users) {
                id.push(user.users_id)
                profileId.push(user.profile_pic_public_id)
            }

            // delete all users
            const deletedUsers = await pool.query(`DELETE FROM users WHERE users_id=ANY($1) AND role=$2`, [id, 'USER']);

            // delete this users profile pic from cloudinary using their public id if it exist
            for (let public_id of profileId) {
                public_id ? await cloudinary.v2.uploader.destroy(public_id, { invalidate: true }) : ""
            }

            await pool.query('COMMIT')

            return res.status(200).json({ status: true, msg: `${deletedUsers.rowCount} account${deletedUsers.rowCount > 1 ? 's' : ''} deleted`, data: id });
        }
        catch (err) {
            await pool.query(`REVOKE`);
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer service" })
        }

    },

    deleteAllAccounts: async (req, res) => {
        try {

            await pool.query(`BEGIN`);
            // find these users that are not admin
            const usersData = await pool.query(`SELECT users_id, profile_pic_public_Id FROM users role=$2`, ['USER'])
            const users = usersData.rows;

            // loop through and get their ids
            let id = []
            let profileId = []
            for (let user of users) {
                id.push(user.users_id)
                profileId.push(user.profile_pic_public_id)
            }

            // delete all users
            const deletedUsers = await pool.query(`DELETE FROM users WHERE users_id=ANY($1) AND role=$2`, [id, 'USER']);

            // delete this users profile pic from cloudinary using their public id if it exist
            for (let public_id of profileId) {
                public_id ? await cloudinary.v2.uploader.destroy(public_id, { invalidate: true }) : ""
            }

            await pool.query('COMMIT')

            return res.status(200).json({ status: true, msg: `${deletedUsers.rowCount} account${deletedUsers.rowCount > 1 ? 's' : ''} deleted`, data: id });

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer service" })
        }
    },
}
