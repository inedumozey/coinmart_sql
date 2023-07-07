const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const bcrypt = require('bcrypt')
const ran = require('../../auth/utils/randomString')
const pool = require('../../db/conn')
const { generateAdminToken } = require('../../auth/utils/generateTokens')

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

// populate factors for withdrawal and transfer
const resolve = (min, max, d) => {
    let factors = []

    for (let i = min; i <= max; i = i + d) {
        factors.push(i)
    }
    return factors
}


module.exports = {

    getConfig: async (req, res) => {
        try {

            // get all config
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            // check if document is empty,
            if (config.length < 1) {

                // create the default and attach default admin password
                const password = await bcrypt.hash("admin", 10);
                const configResult = await pool.query(`INSERT INTO config(_id, admin_password) VALUES($1, $2) RETURNING *`, [ran.uuid(), password])
                config = configResult.rows[0]
                const obj = {
                    _id: config._id,
                    unverifiedUserLifeSpan: config.unverified_user_lifespan,
                    totalMembers: config.total_members,
                    totalInvestors: config.total_investors,
                    currency: config.currency,
                    investmentLimits: config.investment_limits,
                    referralBonusPercentage: config.referral_bonus_percentage,
                    referralBonusLimit: config.referral_bonus_limit,
                    referralContestPercentage: config.referral_contest_percentage,
                    referralContestStarts: config.referral_contest_starts,
                    referralContestStops: config.referral_contest_stops,
                    withdrawableFactors: config.withdrawable_factors,
                    transferableFactors: config.transferable_factors,
                    minWithdrawableLimit: config.min_withdrawable_limit,
                    maxWithdrawableLimit: config.max_withdrawable_limit,
                    withdrawableCommonDiff: config.withdrawable_common_diff,
                    minTransferableLimit: config.min_transferable_limit,
                    maxTransferableLimit: config.max_transferable_limit,
                    transferableCommonDiff: config.transferable_common_diff,
                    pendingWithdrawalDuration: config.pending_withdrawal_duration,
                    totalWithdrawal: config.total_withdrawal,
                    membersCountry: config.members_country,
                    totalDeposit: config.total_deposit,
                    referralContestPrizes: config.referral_contest_prizes,
                    withdrawableCoins: config.withdrawable_coins,
                    allowTransfer: config.allow_transfer,
                    allowWithdrawal: config.allow_withdrawal,
                    allowInvestment: config.allow_investment,
                    allowReferralContest: config.allow_referral_contest,
                    startContestReg: config.start_contest_reg,
                    adminPassword: config.admin_password
                }
                return res.status(200).json({ status: true, msg: "successful", data: obj });
            }

            // otherwise, get the existing ones
            configResult = await pool.query("SELECT * FROM config")
            config = configResult.rows[0]

            const obj = {
                _id: config._id,
                unverifiedUserLifeSpan: config.unverified_user_lifespan,
                totalMembers: config.total_members,
                totalInvestors: config.total_investors,
                currency: config.currency,
                investmentLimits: config.investment_limits,
                referralBonusPercentage: config.referral_bonus_percentage,
                referralBonusLimit: config.referral_bonus_limit,
                referralContestPercentage: config.referral_contest_percentage,
                referralContestStarts: config.referral_contest_starts,
                referralContestStops: config.referral_contest_stops,
                withdrawableFactors: config.withdrawable_factors,
                transferableFactors: config.transferable_factors,
                minWithdrawableLimit: config.min_withdrawable_limit,
                maxWithdrawableLimit: config.max_withdrawable_limit,
                withdrawableCommonDiff: config.withdrawable_common_diff,
                minTransferableLimit: config.min_transferable_limit,
                maxTransferableLimit: config.max_transferable_limit,
                transferableCommonDiff: config.transferable_common_diff,
                pendingWithdrawalDuration: config.pending_withdrawal_duration,
                totalWithdrawal: config.total_withdrawal,
                membersCountry: config.members_country,
                totalDeposit: config.total_deposit,
                referralContestPrizes: config.referral_contest_prizes,
                withdrawableCoins: config.withdrawable_coins,
                allowTransfer: config.allow_transfer,
                allowWithdrawal: config.allow_withdrawal,
                allowInvestment: config.allow_investment,
                allowReferralContest: config.allow_referral_contest,
                startContestReg: config.start_contest_reg,
                adminPassword: config.admin_password
            }
            return res.status(200).json({ status: true, msg: "successful", data: obj })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }

    },

    updateConfig: async (req, res) => {
        try {
            pool.query('BEGIN');

            const data = {
                unverifiedUserLifeSpan: Number(DOMPurify.sanitize(req.body.unverifiedUserLifeSpan)),
                totalMembers: Number(DOMPurify.sanitize(req.body.totalMembers)),
                totalInvestors: Number(DOMPurify.sanitize(req.body.totalInvestors)),
                currency: DOMPurify.sanitize(req.body.currency),
                investmentLimits: Number(DOMPurify.sanitize(req.body.investmentLimits)),
                referralBonusPercentage: Number(DOMPurify.sanitize(req.body.referralBonusPercentage)),
                referralBonusLimit: Number(DOMPurify.sanitize(req.body.referralBonusLimit)),
                referralContestPercentage: Number(DOMPurify.sanitize(req.body.referralContestPercentage)),
                referralBonusPercentageForMasterPlan: Number(DOMPurify.sanitize(req.body.referralBonusPercentageForMasterPlan)),
                referralBonusMaxCountForMasterPlan: Number(DOMPurify.sanitize(req.body.referralBonusMaxCountForMasterPlan)),
                referralContestStarts: DOMPurify.sanitize(req.body.referralContestStarts),
                referralContestStops: DOMPurify.sanitize(req.body.referralContestStops),
                minWithdrawableLimit: Number(DOMPurify.sanitize(req.body.minWithdrawableLimit)),
                maxWithdrawableLimit: Number(DOMPurify.sanitize(req.body.maxWithdrawableLimit)),
                withdrawableCommonDiff: Number(DOMPurify.sanitize(req.body.withdrawableCommonDiff)),
                masterPlanAmountLimit: Number(DOMPurify.sanitize(req.body.masterPlanAmountLimit)),
                minTransferableLimit: Number(DOMPurify.sanitize(req.body.minTransferableLimit)),
                maxTransferableLimit: Number(DOMPurify.sanitize(req.body.maxTransferableLimit)),
                transferableCommonDiff: Number(DOMPurify.sanitize(req.body.transferableCommonDiff)),
                pendingWithdrawalDuration: Number(DOMPurify.sanitize(req.body.pendingWithdrawalDuration)),
                totalWithdrawal: Number(DOMPurify.sanitize(req.body.totalWithdrawal)),
                membersCountry: Number(DOMPurify.sanitize(req.body.membersCountry)),
                totalDeposit: Number(DOMPurify.sanitize(req.body.totalDeposit)),

                // array fields
                referralContestPrizes: req.body.referralContestPrizes,
                withdrawableCoins: req.body.withdrawableCoins,

                // boolean fields
                allowTransfer: DOMPurify.sanitize(req.body.allowTransfer),
                allowWithdrawal: DOMPurify.sanitize(req.body.allowWithdrawal),
                allowInvestment: DOMPurify.sanitize(req.body.allowInvestment),
                allowReferralContest: DOMPurify.sanitize(req.body.allowReferralContest),
                startContestReg: DOMPurify.sanitize(req.body.startContestReg),
            }

            // get all config
            // const config = await Config.find();
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            // check if document is empty,
            if (config.length < 1) {
                // create the default and attach default admin password
                let password = await bcrypt.hash("admin", 10);
                configResult = await pool.query(`INSERT INTO config(_id, admin_password) VALUES($1, $2) RETURNING *`, [ran.uuid(), password])
                config = configResult.rows[0]

                const obj = {
                    _id: config._id,
                    unverifiedUserLifeSpan: config.unverified_user_lifespan,
                    totalMembers: config.total_members,
                    totalInvestors: config.total_investors,
                    currency: config.currency,
                    investmentLimits: config.investment_limits,
                    referralBonusPercentage: config.referral_bonus_percentage,
                    referralBonusLimit: config.referral_bonus_limit,
                    referralContestPercentage: config.referral_contest_percentage,
                    referralContestStarts: config.referral_contest_starts,
                    referralContestStops: config.referral_contest_stops,
                    withdrawableFactors: config.withdrawable_factors,
                    transferableFactors: config.transferable_factors,
                    minWithdrawableLimit: config.min_withdrawable_limit,
                    maxWithdrawableLimit: config.max_withdrawable_limit,
                    withdrawableCommonDiff: config.withdrawable_common_diff,
                    minTransferableLimit: config.min_transferable_limit,
                    maxTransferableLimit: config.max_transferable_limit,
                    transferableCommonDiff: config.transferable_common_diff,
                    pendingWithdrawalDuration: config.pending_withdrawal_duration,
                    totalWithdrawal: config.total_withdrawal,
                    membersCountry: config.members_country,
                    totalDeposit: config.total_deposit,
                    referralContestPrizes: config.referral_contest_prizes,
                    withdrawableCoins: config.withdrawable_coins,
                    allowTransfer: config.allow_transfer,
                    allowWithdrawal: config.allow_withdrawal,
                    allowInvestment: config.allow_investment,
                    allowReferralContest: config.allow_referral_contest,
                    startContestReg: config.start_contest_reg,
                    adminPassword: config.admin_password
                }
                return res.status(200).json({ status: true, msg: "successful", data: obj });
            }
            else {

                //get the first and only id
                const id = config[0]._id;


                configResult = await pool.query(`UPDATE config SET
                    unverified_user_lifespan = $2,
                    total_members=$3,
                    total_investors = $4,
                    currency = $5,
                    investment_limits = $6,
                    referral_bonus_percentage = $7,
                    referral_bonus_limit = $8,
                    referral_contest_percentage = $9,
                    referral_contest_starts = $10,
                    referral_contest_stops = $11,
                    min_withdrawable_limit = $12,
                    max_withdrawable_limit = $13,
                    withdrawable_common_diff = $14,
                    min_transferable_limit = $15,
                    max_transferable_limit = $16,
                    transferable_common_diff = $17,
                    pending_withdrawal_duration = $18,
                    total_withdrawal = $19,
                    members_country = $20,
                    total_deposit = $21,
                    referral_contest_prizes = $22,
                    withdrawable_coins = $23,
                    withdrawable_factors = $24,
                    transferable_factors = $25,
                    allow_transfer = $26,
                    allow_withdrawal = $27,
                    allow_investment = $28,
                    allow_referral_contest = $29,
                    start_contest_reg = $30,
                    admin_password = $31
                    

                    WHERE _id=$1

                    RETURNING *`,
                    [
                        id,
                        data.unverifiedUserLifeSpan ? data.unverifiedUserLifeSpan : config[0].unverified_user_Lifespan,
                        data.totalMembers ? data.totalMembers : config[0].total_members,
                        data.totalInvestors ? data.totalInvestors : config[0].total_investors,
                        data.currency ? data.currency : config[0].currency,
                        data.investmentLimits ? data.investmentLimits : config[0].investment_limits,
                        data.referralBonusPercentage ? data.referralBonusPercentage : config[0].referral_bonus_percentage,
                        data.referralBonusLimit ? data.referralBonusLimit : config[0].referral_bonus_limit,
                        data.referralContestPercentage ? data.referralContestPercentage : config[0].referral_contest_percentage,
                        data.referralContestStarts ? data.referralContestStarts : config[0].referral_contest_starts,
                        data.referralContestStops ? data.referralContestStops : config[0].referral_contest_stops,
                        data.minWithdrawableLimit ? data.minWithdrawableLimit : config[0].min_withdrawable_limit,
                        data.maxWithdrawableLimit ? data.maxWithdrawableLimit : config[0].max_withdrawable_limit,
                        data.withdrawableCommonDiff ? data.withdrawableCommonDiff : config[0].withdrawable_common_diff,
                        data.minTransferableLimit ? data.minTransferableLimit : config[0].min_transferable_limit,
                        data.maxTransferableLimit ? data.maxTransferableLimit : config[0].max_transferable_limit,
                        data.transferableCommonDiff ? data.transferableCommonDiff : config[0].transferable_common_diff,
                        data.pendingWithdrawalDuration ? data.pendingWithdrawalDuration : config[0].pending_withdrawal_duration,
                        data.totalWithdrawal ? data.totalWithdrawal : config[0].total_withdrawal,
                        data.membersCountry ? data.membersCountry : config[0].members_country,
                        data.totalDeposit ? data.totalDeposit : config[0].total_deposit,

                        // array fields

                        // this array comes from the client
                        data.referralContestPrizes ? data.referralContestPrizes : config[0].referral_contest_prizes,

                        // this array comes from the client
                        data.withdrawableCoins ? data.withdrawableCoins : config[0].withdrawable_coins,

                        // this array is made from minWithdrawableLimit, maxWithdrawableLimit and withdrawableCommonDiff, hence all must be present for the update otherwise, use config data
                        // When the factor has only 1 value [1], users are granted the chance to withdraw any infinity amount
                        (data.minWithdrawableLimit && data.maxWithdrawableLimit && data.withdrawableCommonDiff) ? resolve(data.minWithdrawableLimit, data.maxWithdrawableLimit, data.withdrawableCommonDiff) : config[0].withdrawable_factors,

                        // this array is made from minTransferableLimit, maxTransferableLimit and transferableCommonDiff, hence all must be present for the update otherwise, use config data
                        // When the factor has only 1 value [1], users are granted the chance to transfer any infinity amount
                        (data.minTransferableLimit && data.maxTransferableLimit && data.transferableCommonDiff) ? resolve(data.minTransferableLimit, data.maxTransferableLimit, data.transferableCommonDiff) : config[0].transferable_factors,

                        // boolean fileds
                        data.allowTransfer ? (data.allowTransfer === 'true' ? true : false) : config[0].allow_transfer,
                        data.allowWithdrawal ? (data.allowWithdrawal === 'true' ? true : false) : config[0].allow_withdrawal,

                        data.allowInvestment ? (data.allowInvestment === 'true' ? true : false) : config[0].allow_investment,
                        data.allowReferralContest ? (data.allowReferralContest === 'true' ? true : false) : config[0].allow_referral_contest,
                        data.startContestReg ? (data.startContestReg === 'true' ? true : false) : config[0].start_contest_reg,

                        // admin password
                        config[0].admin_password
                    ]);

                config = configResult.rows[0];


                const obj = {
                    _id: config._id,
                    unverifiedUserLifeSpan: config.unverified_user_lifespan,
                    totalMembers: config.total_members,
                    totalInvestors: config.total_investors,
                    currency: config.currency,
                    investmentLimits: config.investment_limits,
                    referralBonusPercentage: config.referral_bonus_percentage,
                    referralBonusLimit: config.referral_bonus_limit,
                    referralContestPercentage: config.referral_contest_percentage,
                    referralContestStarts: config.referral_contest_starts,
                    referralContestStops: config.referral_contest_stops,
                    withdrawableFactors: config.withdrawable_factors,
                    transferableFactors: config.transferable_factors,
                    minWithdrawableLimit: config.min_withdrawable_limit,
                    maxWithdrawableLimit: config.max_withdrawable_limit,
                    withdrawableCommonDiff: config.withdrawable_common_diff,
                    minTransferableLimit: config.min_transferable_limit,
                    maxTransferableLimit: config.max_transferable_limit,
                    transferableCommonDiff: config.transferable_common_diff,
                    pendingWithdrawalDuration: config.pending_withdrawal_duration,
                    totalWithdrawal: config.total_withdrawal,
                    membersCountry: config.members_country,
                    totalDeposit: config.total_deposit,
                    referralContestPrizes: config.referral_contest_prizes,
                    withdrawableCoins: config.withdrawable_coins,
                    allowTransfer: config.allow_transfer,
                    allowWithdrawal: config.allow_withdrawal,
                    allowInvestment: config.allow_investment,
                    allowReferralContest: config.allow_referral_contest,
                    startContestReg: config.start_contest_reg,
                    adminPassword: config.admin_password
                }

                return res.status(200).json({ status: true, msg: "successful", data: obj })
            }
        }
        catch (err) {
            pool.query('ROLLBACK')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { password } = req.body
            const userId = req.user;

            // find the login user
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]

            // get admin password from config
            const configData = await pool.query(`SELECT admin_password FROM config`)
            const config = configData.rows[0]

            if (!user) {
                return res.status(400).json({ status: false, msg: "User not found" });
            }

            if (user.role.toLowerCase() !== 'admin') {
                return res.status(400).json({ status: false, msg: "Access denied to non-admin users" });
            }

            if (!config.admin_password) {
                return res.status(400).json({ status: false, msg: "Access denied! Try again" });
            };

            if (!password) {
                return res.status(400).json({ status: false, msg: "the field is required!" });
            }

            // match provided password with the one in database
            const match = await bcrypt.compare(password.toString(), config.admin_password)

            if (!match) {
                return res.status(400).json({ status: false, msg: "Wrong password" });
            }

            // log the user in
            const admintoken = generateAdminToken(user.users_id);

            return res.status(200).json({
                status: true,
                msg: "Your are logged in as admin",
                admintoken,
            })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message });
        }
    },

    resetAdminPassword: async (req, res) => {
        try {
            // get all config
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            // check if document is empty,
            if (config.length < 1) {

                // create the default and attach default admin password
                const password = await bcrypt.hash("admin", 10);
                await pool.query(`INSERT INTO config(_id, admin_password) VALUES($1, $2) RETURNING *`, [ran.uuid(), password])

                const obj = {
                    _id: config._id,
                    unverifiedUserLifeSpan: config.unverified_user_lifespan,
                    totalMembers: config.total_members,
                    totalInvestors: config.total_investors,
                    currency: config.currency,
                    investmentLimits: config.investment_limits,
                    referralBonusPercentage: config.referral_bonus_percentage,
                    referralBonusLimit: config.referral_bonus_limit,
                    referralContestPercentage: config.referral_contest_percentage,
                    referralContestStarts: config.referral_contest_starts,
                    referralContestStops: config.referral_contest_stops,
                    withdrawableFactors: config.withdrawable_factors,
                    transferableFactors: config.transferable_factors,
                    minWithdrawableLimit: config.min_withdrawable_limit,
                    maxWithdrawableLimit: config.max_withdrawable_limit,
                    withdrawableCommonDiff: config.withdrawable_common_diff,
                    minTransferableLimit: config.min_transferable_limit,
                    maxTransferableLimit: config.max_transferable_limit,
                    transferableCommonDiff: config.transferable_common_diff,
                    pendingWithdrawalDuration: config.pending_withdrawal_duration,
                    totalWithdrawal: config.total_withdrawal,
                    membersCountry: config.members_country,
                    totalDeposit: config.total_deposit,
                    referralContestPrizes: config.referral_contest_prizes,
                    withdrawableCoins: config.withdrawable_coins,
                    allowTransfer: config.allow_transfer,
                    allowWithdrawal: config.allow_withdrawal,
                    allowInvestment: config.allow_investment,
                    allowReferralContest: config.allow_referral_contest,
                    startContestReg: config.start_contest_reg,
                    adminPassword: config.admin_password
                }
                return res.status(200).json({ status: true, msg: "successful", data: obj });
            }

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
            const userResult = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const user = userResult.rows[0]


            if (!user) {
                return res.status(400).json({ status: false, msg: "User not found" });
            }

            if (!user.is_supper_admin) {
                return res.status(400).json({ status: false, msg: "Only supper admin can reset admin password" });
            }

            else if (data.newPassword.length < 6) {
                return res.status(405).json({ status: false, msg: "Password too short, must not be less than 6 characters" });
            }

            if (data.newPassword != data.newCpassword) {
                return res.status(405).json({ status: false, msg: "Passwords do not match!" });
            }

            // match provided oldPassword with the one in database
            const match = await bcrypt.compare(data.oldPassword.toString(), config[0].admin_password)

            if (!match) {
                return res.status(400).json({ status: false, msg: "The old password is invalid" });
            }

            // 2. hash and update user model with the new password
            const hashedPass = await bcrypt.hash(data.newPassword, 10);

            const id = config[0]._id
            await pool.query(`UPDATE config SET admin_password=$1 WHERE _id=$2`, [hashedPass, id])

            return res.status(200).json({ status: true, msg: "Password changed successfully" });

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    }
}

