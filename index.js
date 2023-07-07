"use strict"

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express();

// parse requests of json type
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse cookie in app
app.use(cookieParser())

// cross-origin request
var corsOptions = {
    origin: [process.env.FRONTEND_BASE_URL, 'http://localhost:3000', 'https://coinmart-inedumozey.vercel.app', 'https://coinmart.vercel.app'],
    optionsSuccessStatus: 200, //for lagacy browser support
    default: process.env.FRONTEND_BASE_URL,
    credentials: true
};
app.use(cors(corsOptions))

// app.use(morgan('combined'))

// routes
app.use('/api/v1/auth', require("./src/auth/routes/auth"));
app.use('/api/v1/profile', require("./src/profile/routes/profile"));
app.use('/api/v1/config', require('./src/websiteConfig/routes/config'));
app.use('/api/v1/transfer', require('./src/internalTransfer/routes/internalTransfer'));
app.use('/api/v1/investment', require('./src/investment/routes/investment'));
app.use('/api/v1/referral', require('./src/referral/routes/referral'));
app.use('/api/v1/', require('./src/deposit/routes/deposit'));
app.use('/api/v1/withdrawal', require('./src/withdrawal/routes/withdrawal'));
app.use('/api/v1/notifications', require('./src/notifications/routes/notification'));
// app.use('/api/v1/testimonials',  require('./src/testimonials/routes/testimonials')); 
app.use('/api/v1/message', require('./src/message/routes/message'));
app.use('/api/v1/history', require("./src/history/routes/routes"));
// app.use('/api/v1/referral-contest',  require('./src/referralContest/routes/referralContest')); 
app.use('/api/v1/payusers', require('./src/payuser/routes/payusers'));

// database route
app.use('/api/v1/db/create-tables', require('./src/db/createTables'));

// normalize port
const normalizePort = (val) => {
    let port = parseInt(val, 10)

    if (isNaN(port)) return val

    if (port >= 0) return port

    return false
}

// connect server
const PORT = normalizePort(process.env.PORT || "4000")
app.listen(PORT, (err) => {
    if (err) {
        console.log(err.message)
    }
    else {
        console.log(`Server Running on Port ${PORT}`)
    }
})

const nodemailer = require("nodemailer");

const sendMail = async (message) => {
    try {

        let transporter = nodemailer.createTransport({
            host: "extractcoinmart.com",
            port: 465,
            secure: fal,
            auth: {
                user: "admin@extractcoinmart.com",
                pass: "@My08036000347"
            },
        });

        let info = await transporter.sendMail(message);

        return info;
    }

    catch (err) {
        return err;
    }
}

var message = {
    from: process.env.EMAIL_USER,
    to: "inedumozey@gmail.com",
    subject: "Message title",
    text: "Test",
    html: "<p>Okay</p>"
};

