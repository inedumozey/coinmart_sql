const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require('../../db/conn')


module.exports = {

    activatedUserAuth: async (req, res, next) => {
        try {
            const authToken = req.headers["authorization"];

            if (!authToken) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login or register" })
            }
            // Verify token
            const token = authToken.split(" ")[1]
            // Verify token
            const data = await jwt.verify(token, process.env.JWT_ACCESS_SECRET)

            if (!data) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login or register" })
            }

            // Use the data to get the user from User table
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [data.id])
            let user = userResult.rows[0]

            //check if user is blocked
            if (user.is_blocked) {
                return res.status(402).json({ status: false, msg: "This account is blocked, please contact customer support" })
            }

            if (!user.is_verified) {
                return res.status(402).json({ status: false, msg: "Your account is not activated, please verify your account" })
            }

            if (user.is_verified) {
                req.user = user.users_id

                next()
            }
            else {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login or register" })
            }
        }
        catch (err) {
            if (err.message == 'invalid signature' || err.message == 'invalid token' || err.message === 'jwt malformed' || err.message === "jwt expired") {
                return res.status(402).json({ status: false, msg: "You are not authorized! Please login or register" })

            }
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    adminAuth: async (req, res, next) => {
        try {
            const authToken = req.headers["authorization-admin"];

            if (!authToken) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }
            // Verify token
            const token = authToken.split(" ")[1]
            // Verify token
            const data = await jwt.verify(token, process.env.JWT_ADMIN_SECRET)

            if (!data) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }

            // Use the data to get the user from User collection
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [data.id])
            let user = userResult.rows[0]

            //check if user is blocked
            if (user.is_blocked) {
                return res.status(402).json({ status: false, msg: "This account is blocked, please contact customer support" })
            }

            if (!user.is_verified) {
                return res.status(402).json({ status: false, msg: "Your account is not activated, please verify your account" })
            }

            if (user.role.toLowerCase() !== 'admin') {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as an admin" })
            }

            if (user.role.toLowerCase() === 'admin') {
                req.user = user.users_id
                next()
            }
            else {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }
        }
        catch (err) {
            if (err.message == 'invalid signature' || err.message == 'invalid token' || err.message === 'jwt malformed' || err.message === "jwt expired") {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })

            }
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    supperAdminAuth: async (req, res, next) => {
        try {
            const authToken = req.headers["authorization-admin"];

            if (!authToken) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }
            // Verify token
            const token = authToken.split(" ")[1]
            // Verify token
            const data = await jwt.verify(token, process.env.JWT_ADMIN_SECRET)

            if (!data) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }

            // Use the data to get the user from User collection
            let userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [data.id])
            let user = userResult.rows[0]

            //check if user is blocked
            if (user.is_blocked) {
                return res.status(402).json({ status: false, msg: "This account is blocked, please contact customer support" })
            }

            if (!user.is_verified) {
                return res.status(402).json({ status: false, msg: "Your account is not activated, please activate your account" })
            }

            if (!user.is_supper_admin) {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as a super admin" })
            }

            if (user.is_supper_admin) {
                req.user = user.users_id
                next()
            }

            else {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })
            }
        }
        catch (err) {
            if (err.message == 'invalid signature' || err.message == 'invalid token' || err.message === 'jwt malformed' || err.message === "jwt expired") {
                return res.status(402).json({ status: false, msg: "You are not authorized, please login as admin" })

            }
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}