const express = require("express")
const pool = require("./conn")
const tables = require("./tables")
const route = express.Router()

async function query() {
    try {
        // const data = await pool.query("SELECT * FROM users")
        // console.log(data.rows)

        // const h = await pool.query("DELETE FROM users WHERE username='drmo2'")
        // console.log(h)

        // const result = await pool.query("DROP TABLE referralhistory")
        // console.log(result)
    }
    catch (err) {
        console.log(err)
    }
}

// query()


route.get("/users", async (req, res) => {
    try {
        await pool.query(tables.createUser);
        res.send("Users' Table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/passwordtoken", async (req, res) => {
    try {
        await pool.query(tables.createPasswordToken);
        res.send("Password Reset Token table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/referralhistory", async (req, res) => {
    try {
        await pool.query(tables.createreferralHistory);
        res.send("Referral History table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/referralcontest", async (req, res) => {
    try {
        await pool.query(tables.createContest);
        res.send("Referral Contest table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/deposit", async (req, res) => {
    try {
        await pool.query(tables.createDeposit);
        res.send("Deposit table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/withdrawal", async (req, res) => {
    try {
        await pool.query(tables.createWithdrawal);
        res.send("Withdrawal table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/config", async (req, res) => {
    try {
        await pool.query(tables.createWebsiteConfig);
        res.send("Website Config table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/testimonials", async (req, res) => {
    try {
        await pool.query(tables.createTestimonials);
        res.send("Testimonials table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/internaltransfer", async (req, res) => {
    try {
        await pool.query(tables.createInternalTransfer);
        res.send("Internal Transfer table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/investmentplan", async (req, res) => {
    try {
        await pool.query(tables.createInvestmentPlan);
        res.send("Investment Plans table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});

route.get("/investment", async (req, res) => {
    try {
        await pool.query(tables.createInvestment);
        res.send("Investment table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});


route.get("/notifications", async (req, res) => {
    try {
        await pool.query(tables.createNotification);
        res.send("Notifications table Created")
    }
    catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
});





module.exports = route

