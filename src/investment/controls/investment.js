require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const pool = require('../../db/conn');
const ran = require('../../auth/utils/randomString')
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

module.exports = {

    getAllPlans: async (req, res) => {
        try {
            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            const dataResult = await pool.query(`SELECT * FROM investmentplan ORDER BY min_amount DESC`)
            const data = dataResult.rows

            let dataArr = []
            for (let i = 0; i < data.length; i++) {
                const obj = {
                    _id: data[i]._id,
                    type: data[i].type,
                    returnPercentage: data[i].return_percentage,
                    point: data[i].point,
                    lifespan: data[i].lifespan,
                    minAmount: data[i].min_amount,
                    maxAmount: data[i].max_amount,
                    createdAt: data[i].created_at,
                    updatedAt: data[i].updated_at,
                    currency
                }
                dataArr.push(obj)
            };

            return res.status(200).json({ status: true, msg: "Plans fetched successfully", data: dataArr })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getPlan: async (req, res) => {
        try {
            const { id } = req.params;

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            const dataResult = await pool.query(`SELECT * FROM investmentplan WHERE _id=$1`, [id])
            const data = dataResult.rows[0]

            // check if the Plan exist
            if (!data) {
                return res.status(400).json({ status: false, msg: "Not found" })
            }

            const obj = {
                _id: data._id,
                type: data.type,
                returnPercentage: data.return_percentage,
                point: data.point,
                lifespan: data.lifespan,
                minAmount: data.min_amount,
                maxAmount: data.max_amount,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                currency
            }

            return res.status(200).json({ status: false, msg: "Plan fetched successfully", data: obj })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer service" })
        }
    },

    setPlan: async (req, res) => {
        try {
            const data = {
                type: DOMPurify.sanitize(req.body.type),
                minAmount: Number(DOMPurify.sanitize(req.body.minAmount)),
                maxAmount: Number(DOMPurify.sanitize(req.body.maxAmount)),
                lifespan: Number(DOMPurify.sanitize(req.body.lifespan)),
                point: Number(DOMPurify.sanitize(req.body.point)),
                returnPercentage: Number(DOMPurify.sanitize(req.body.returnPercentage)),
            }

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            // validate form input
            if (!req.body.type || !req.body.maxAmount || !req.body.minAmount || !req.body.lifespan || !req.body.point || !req.body.returnPercentage) {
                return res.status(400).json({ status: false, msg: "All fields are required" });
            }

            if (data.maxAmount < 0 || data.minAmount < 0 || data.lifespan < 0 || data.point < 0 || data.returnPercentage < 0) {
                return res.status(400).json({ status: false, msg: "Negative value found!" });
            }

            // minAmount cannot be more than maxAmount except when the maxAmount = 0
            if (data.maxAmount > 0 && data.minAmount > data.maxAmount) {
                return res.status(400).json({ status: false, msg: "Minimun amount cannot be more than Maximun amount" });
            }

            // check to makesure plan type is not already in existance
            const investmentPlansResult = await pool.query(`SELECT * FROM investmentplan WHERE type=$1`, [data.type.toLowerCase()])
            const investmentPlans = investmentPlansResult.rows[0]

            if (investmentPlans) {
                return res.status(400).json({ status: false, msg: "Plan already exist" })
            }
            // save the data to the database
            await pool.query(`INSERT INTO
                investmentplan(
                    _id,
                    type,
                    min_amount,
                    max_amount,
                    lifespan,
                    point,
                    return_percentage
                )
                VALUES($1, $2, $3, $4, $5, $6, $7)`,
                [
                    ran.uuid(),
                    data.type.toLowerCase(),
                    data.minAmount.toFixed(8),
                    data.maxAmount.toFixed(8),
                    data.lifespan,
                    data.point,
                    data.returnPercentage
                ]
            );

            return res.status(200).json({ status: true, msg: "successful" })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    updatePlan: async (req, res) => {
        try {
            const { id } = req.params;

            const data = {
                type: DOMPurify.sanitize(req.body.type),
                minAmount: Number(DOMPurify.sanitize(req.body.minAmount)),
                maxAmount: Number(DOMPurify.sanitize(req.body.maxAmount)),
                lifespan: Number(DOMPurify.sanitize(req.body.lifespan)),
                point: Number(DOMPurify.sanitize(req.body.point)),
                returnPercentage: Number(DOMPurify.sanitize(req.body.returnPercentage)),
            }

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            // validate form input
            if (!req.body.type || !req.body.maxAmount || !req.body.minAmount || !req.body.lifespan || !req.body.point || !req.body.returnPercentage) {
                return res.status(400).json({ status: false, msg: "All fields are required" });
            }

            if (data.maxAmount < 0 || data.minAmount < 0 || data.lifespan < 0 || data.point < 0 || data.returnPercentage < 0) {
                return res.status(400).json({ status: false, msg: "Negative value found!" });
            }

            // minAmount cannot be more than maxAmount except when the maxAmount = 0
            if (data.maxAmount > 0 && data.minAmount > data.maxAmount) {
                return res.status(400).json({ status: false, msg: "Minimun amount cannot be more than Maximun amount" });
            }

            // chekc if the id does not exist
            const investmentPlansResult = await pool.query(`SELECT * FROM investmentplan WHERE _id=$1`, [id])
            const data_ = investmentPlansResult.rows[0];
            if (!data_) {
                return res.status(400).json({ status: false, msg: "Plan not found!" })
            }

            // check to makesure plan types is not already in existance when not thesame as the original plan
            const updatingPlanResult = await pool.query(`SELECT * FROM investmentplan WHERE _id=$1`, [id])
            const updatingPlan = updatingPlanResult.rows[0];

            if (updatingPlan.type.toLowerCase() !== data.type.toLowerCase()) {
                const oldDiffPlanResult = await pool.query(`SELECT * FROM investmentplan WHERE type=$1`, [data.type.toLowerCase()])
                const oldDiffPlan = oldDiffPlanResult.rows[0];

                if (oldDiffPlan) {
                    return res.status(400).json({ status: false, msg: "Plan already exist" })
                }
            }

            // update the data in the database
            await pool.query(`UPDATE investmentplan SET
                type=$1,
                min_amount=$2,
                max_amount=$3,
                lifespan=$4,
                point=$5,
                return_percentage=$6,
                updated_at

                WHERE _id=$7`,
                [
                    data.type.toLowerCase(),
                    data.minAmount.toFixed(8),
                    data.maxAmount.toFixed(8),
                    data.lifespan,
                    data.point,
                    data.returnPercentage,
                    id,
                    new Date()
                ]
            )

            return res.status(200).json({ status: true, msg: "plan updated" })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    deletePlan: async (req, res) => {
        try {
            const { id } = req.params;

            await pool.query(`DELETE FROM investmentplan WHERE _id=$1`, [id])

            return res.status(200).json({ status: true, msg: "Plan deleted" })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    deleteAllPlans: async (req, res) => {
        try {

            await pool.query(`DELETE FROM investmentplan`)

            return res.status(200).json({ status: true, msg: "All plans deleted" })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    // investment
    invest: async (req, res) => {
        try {
            pool.query('BEGIN')
            const { id } = req.params // planId past in params
            const userId = req.user;

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]
            let config = configResult.rows;

            const referralBonusPercentage = config && config[0].referral_bonus_percentage
            const referralBonusLimit = config && config[0].referral_bonus_limit
            const investmentLimits = config && config[0].investment_limits
            const allowInvestment = config && config[0].allow_investment;
            const allowReferralContest = config && config[0].allow_referral_contest
            const referralContestStarts = config && config[0].referral_contest_starts;
            const referralContestStops = config && config[0].referral_contest_stops

            if (!allowInvestment) {
                return res.status(400).json({ status: false, msg: "Currenctly not available, please try again later later" })
            }

            const data = {
                amount: Number(DOMPurify.sanitize(req.body.amount)),
            }

            // get the logged in user from user database
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]

            // check if the plan exist
            const planResult = await pool.query(`SELECT * FROM investmentplan WHERE _id=$1`, [id])
            const plan = planResult.rows[0];

            if (!plan) {
                return res.status(400).json({ status: false, msg: "Plan not found" })
            }

            // check if amount is more or less than the plan amount
            if (data.amount < plan.min_amount) {
                return res.status(400).json({ status: false, msg: "Invalid amount" })
            }

            // all plans with maximun of 0 is regarded as unlimited plan 
            if (plan.max_amount > 0 && data.amount > plan.max_amount) {
                return res.status(400).json({ status: false, msg: "Invalid amount" })
            }

            // get all plans the user has
            const userPlansResult = await pool.query(`SELECT * FROM investment WHERE users_id=$1`, [userId])
            const userPlans = userPlansResult.rows;

            let count = 0;
            let samePlan = 0;

            // loop through all the investment the logged user has
            for (let userPlan of userPlans) {

                // increament the count base on how many active investment he has running
                if (userPlan.is_active) {
                    ++count
                }

                // check for active investment plans, if same with the plan he is requesting for currently, increament samePlan
                if (userPlan.is_active && userPlan.type === plan.type) {
                    ++samePlan
                }
            }

            // referral contest
            const currentTime = Date.now()
            const startsAt = new Date(referralContestStarts).getTime()
            const stopsAt = new Date(referralContestStops).getTime()

            const allowContest = currentTime >= startsAt && currentTime <= stopsAt && allowReferralContest

            // if count is more than, refuse him of further investment
            if (count >= investmentLimits) {
                return res.status(400).json({ status: false, msg: `You cannot have more than ${investmentLimits} active investments` })
            }
            else {

                // no user should have same active plan for more than once
                if (samePlan >= 1) {
                    return res.status(400).json({ status: false, msg: "You have this plan running already" })
                }

                else {

                    // check to makesure he does not invest more than his total account balance
                    if (data.amount > user.amount) {
                        return res.status(400).json({ status: false, msg: "Insufficient balance" })
                    }

                    // save the data
                    // get the investment returnPercentage
                    const returnPercentage = Number(plan.return_percentage)

                    // calculate the reward
                    const rewards = ((returnPercentage / 100) * data.amount) + data.amount;

                    // Insert new data in investment table

                    await pool.query(`INSERT INTO
                        investment(
                            _id,
                            type,
                            lifespan,
                            return_percentage,
                            rewards,
                            users_id,
                            amount
                        )
                        VALUES($1, $2, $3, $4, $5, $6, $7)
                        `,
                        [
                            ran.uuid(),
                            plan.type,
                            plan.lifespan,
                            returnPercentage,
                            rewards,
                            userId,
                            data.amount.toFixed(8),
                        ]
                    )

                    // Update the user table by removing this investment plan amount from their total account balance
                    const amount = (user.amount - data.amount).toFixed(8);
                    await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [amount, userId])

                    // Check ths user collection in User adatabse to see if the number of times he has investment is not more than referralBonusLimit (number of times he will returns referral bonus to his referrer)
                    if (referralBonusLimit > user.investment_count) {

                        // check if user was referred by another user, then return their referral bonus to this referrer using their first investment (this is only for the first investment)
                        if (user.referrer_id) {

                            // get the referrerUser
                            const referrerUserResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [user.referrer_id])
                            const referrerUser = referrerUserResult.rows[0];

                            // calculate the referalBonus
                            const referralBonus = referralBonusPercentage / 100 * data.amount;
                            const amount = (referrerUser.amount + referralBonus).toFixed(8);

                            // update the referrer account balance with this referralBonus
                            await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [amount, user.referrer_id]);

                            // update referral History database
                            await pool.query(`UPDATE referralhistory SET
                                rewards=rewards+$1
                                WHERE referrer_id=$2 AND referree_id=$3`,
                                [referralBonus.toFixed(8), user.referrer_id, userId]
                            )

                            if (allowContest) {
                                // update the referral ReferralContest collection if allowContest is true
                                await pool.query(`UPDATE referralcontest SET point=point+$1 WHERE users_id=$2`, [plan.point, user.referrer_id]);
                            }
                        }
                    }

                    // update referree user and change hasInvested to true and increment investmentCount by 1
                    await pool.query(`UPDATE users SET has_invested=$1, investment_count=investment_count+1 WHERE users_id=$2`, [true, userId]);


                    pool.query('COMMIT');
                    return res.status(200).json({ status: true, msg: `Investment started for ${plan.type}` });
                }
            }
        }
        catch (err) {
            pool.query('ROLLBACK');
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllInvestments: async (req, res) => {
        try {

            const userId = req.user;

            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0]

            const maturedInvestmentResult = await pool.query(`SELECT * FROM investment WHERE users_id=$1 AND is_active=$2 ORDER BY updated_at DESC`, [userId, false])
            const maturedInvestment = maturedInvestmentResult.rows;

            const maturedData = []
            for (let i = 0; i < maturedInvestment.length; i++) {
                const obj = {
                    _id: maturedInvestment[i]._id,
                    userId: maturedInvestment[i].users_id,
                    type: maturedInvestment[i].type,
                    returnPercentage: maturedInvestment[i].return_percentage,
                    lifespan: maturedInvestment[i].lifespan,
                    amount: maturedInvestment[i].amount,
                    rewards: maturedInvestment[i].rewards,
                    rewarded: maturedInvestment[i].rewarded,
                    isActive: maturedInvestment[i].is_active,
                    status: maturedInvestment[i].status,
                    transactionType: maturedInvestment[i].transaction_type,
                    createdAt: maturedInvestment[i].created_at,
                    updatedAt: maturedInvestment[i].updated_at,
                    currency
                }
                maturedData.push(obj)

            }

            const activeInvestmentResult = await pool.query(`SELECT * FROM investment WHERE users_id=$1 AND is_active=$2 ORDER BY updated_at DESC`, [userId, true])
            const activeInvestment = activeInvestmentResult.rows;

            const activeData = []
            for (let i = 0; i < activeInvestment.length; i++) {
                obj = {
                    _id: activeInvestment[i]._id,
                    userId: activeInvestment[i].users_id,
                    type: activeInvestment[i].type,
                    returnPercentage: activeInvestment[i].return_percentage,
                    lifespan: activeInvestment[i].lifespan,
                    amount: activeInvestment[i].amount,
                    rewards: activeInvestment[i].rewards,
                    rewarded: activeInvestment[i].rewarded,
                    isActive: activeInvestment[i].is_active,
                    status: activeInvestment[i].status,
                    transactionType: activeInvestment[i].transaction_type,
                    createdAt: activeInvestment[i].created_at,
                    updatedAt: activeInvestment[i].updated_at,
                    currency
                }
                activeData.push(obj)
            }

            return res.status(200).send({ status: true, msg: 'Successful', data: { maturedInvestment: maturedData, activeInvestment: activeData } })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getAllInvestments_admin: async (req, res) => {
        try {
            // get config
            let configResult = await pool.query("SELECT * FROM config")
            let { currency } = configResult.rows[0];

            async function getHx() {

                // get only pending withdrawal hx from the database
                const investmentHxResult = await pool.query(`SELECT * FROM investment ORDER BY updated_at DESC`);
                const investmentHx = investmentHxResult.rows;

                // find every users that owns this withdrawal hx
                let usersIdArr = []
                for (let i = 0; i < investmentHx.length; i++) {
                    usersIdArr.push(investmentHx[i].users_id)
                }
                const userResult = await pool.query(`SELECT users_id, email, username, amount FROM users WHERE users_id=ANY($1)`, [usersIdArr]);
                let users = userResult.rows;

                let investmentHxData = []
                for (let i = 0; i < investmentHx.length; i++) {
                    users.filter(users => {

                        if (investmentHx[i].users_id === users.users_id) {

                            let obj = {
                                _id: investmentHx[i]._id,
                                type: investmentHx[i].type,
                                returnPercentage: investmentHx[i].return_percentage,
                                lifespan: investmentHx[i].lifespan,
                                amount: investmentHx[i].amount,
                                rewards: investmentHx[i].rewards,
                                rewarded: investmentHx[i].rewarded,
                                isActive: investmentHx[i].is_active,
                                status: investmentHx[i].status,
                                transactionType: investmentHx[i].transaction_type,
                                createdAt: investmentHx[i].created_at,
                                updatedAt: investmentHx[i].updated_at,
                                currency,
                                userId: {
                                    _id: users.users_id,
                                    email: users.email,
                                    username: users.username,
                                    amount: users.amount,
                                }
                            }
                            investmentHxData.push(obj)
                        }
                    })
                }
                return investmentHxData;
            }

            const investmentData = await getHx();

            return res.status(200).send({ status: true, msg: 'Successful', data: investmentData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getInvestment: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user;

            // get the txn
            // const txn = await Investment.findOne({ _id: id }).populate({ path: 'planId' });

            // if (!txn) {
            //     return res.status(400).json({ status: false, msg: "Investment not found found" })

            // }
            // else {

            //     // check if the loggeduser was the one that owns the investment hx or the admin
            //     if (txn.userId.toString() === userId.toString() || loggeduser.isAdmin) {
            //         const txnData = await Investment.findOne({ _id: id }).populate({ path: 'planId' }).populate({ path: 'userId', select: ['_id', 'email', 'username', 'isAdmin'] });
            //         return res.status(200).send({ status: true, msg: 'Success', data: txnData })
            //     }
            //     else {
            //         return res.status(400).send({ status: false, msg: 'Access denied!' })
            //     }
            // }

            return res.status(200).send({ status: false, msg: 'Successfull' })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: msg.message || "Server error, please contact customer support" })
        }
    },

    resolve: async (req, res) => {
        try {
            pool.query('BEGIN')

            // get all investments
            const investmentsResult = await pool.query(`SELECT * FROM investment`)
            const investments = investmentsResult.rows;

            // check if there are investment
            let maturedInvestments = []
            let activeInvestment = []
            if (!investments) {
                return res.status(200).json({ status: true, msg: "No any investment made" })
            }

            // loop through investments
            for (let investment of investments) {
                const currentTime = new Date().getTime() / 1000 // seconds

                const createTime = new Date(investment.created_at).getTime() / 1000 // seconds

                const investmentLifespan = Number(investment.lifespan)

                // check for all active investment that have matured
                if (currentTime - createTime >= investmentLifespan && investment.is_active) {
                    maturedInvestments.push(investment)

                }
                else {
                    activeInvestment.push(investment)
                }
            }

            // fetch the users with these maturedInvestments and update their account balance
            if (maturedInvestments.length > 0) {
                for (let maturedInvestment of maturedInvestments) {

                    // get the users with these investments
                    const userId = maturedInvestment.users_id.toString();
                    const usersResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
                    const users = usersResult.rows[0]

                    // update the investment database,
                    await pool.query(`UPDATE investment SET
                        rewarded=$1,
                        is_active=$2,
                        status=$3,
                        updated_at=$4

                        WHERE _id=$5`,
                        [
                            true,
                            false,
                            'Matured',
                            new Date(),
                            maturedInvestment._id
                        ]
                    )

                    // update the users with the amount
                    const amount = users && (users.amount + maturedInvestment.rewards).toFixed(8)
                    await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [amount, userId]);
                    pool.query('COMMIT')
                }

                return res.status(200).json({ status: true, msg: "successful" })
            }
            else {
                pool.query('ROLLBACK')
                return res.status(200).json({ status: true, msg: "successful" })
            }

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    resolveManually: async (req, res) => {
        try {
            const { id } = req.params;
            // update the investment database, 
            const investmentResult = await pool.query(`SELECT * FROM investment WHERE _ID=$1`, [id])
            const investment = investmentResult.rows[0];

            // update the user
            const usersResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [investment.users_id])
            const user = usersResult.rows[0]

            if (investment.is_active) {
                await pool.query(`UPDATE investment SET
                    rewarded=$1,
                    is_active=$2,
                    status=$3,
                    updated_at=$4

                    WHERE _id=$5`,
                    [
                        true,
                        false,
                        'Matured',
                        new Date(),
                        id
                    ]
                )

                const amount = (user.amount + investment.rewards).toFixed(8);
                await pool.query(`UPDATE users SET amount=$1 WHERE users_id=$2`, [amount, investment.userId]);

                return res.status(200).json({ status: true, msg: "successful" })
            }
            else {
                return res.status(200).json({ status: true, msg: "successful" })
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}