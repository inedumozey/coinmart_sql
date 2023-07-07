require("dotenv").config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const pool = require('../../db/conn');
const ran = require('../../auth/utils/randomString')

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window)

module.exports = {

    getReferralHistories: async (req, res) => {
        try {
            const userId = req.user;

            // const currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            // 3. get the referral history
            const referralHistoryResult = await pool.query(`SELECT * FROM referralhistory WHERE referrer_id=$1`, [userId]);
            let referralHistory = referralHistoryResult.rows;

            let referreeId = [];
            for (let i = 0; i < referralHistory.length; i++) {
                referreeId.push(referralHistory[i].referree_id);
            }

            // 3. get the referree
            const referreResult = await pool.query(`SELECT users_id, username, email FROM users WHERE users_id=ANY($1)`, [referreeId]);
            let referres = referreResult.rows;

            let referralData = [];
            for (let i = 0; i < referralHistory.length; i++) {

                referres.filter(referres => {
                    if (referralHistory[i].referree_id === referres.users_id) {

                        const obj = {
                            _id: referralHistory[i]._id,
                            referrerId: referralHistory[i].referrer_id,
                            rewards: referralHistory[i].rewards,
                            type: referralHistory[i].type,
                            createdAt: referralHistory[i].created_at,
                            updatedAt: referralHistory[i].updated_at,
                            currency,
                            referreeUsername: referralHistory[i].referree_username,
                            referreeId: {
                                _id: referres.users_id,
                                username: referres.username,
                                email: referres.email
                            }
                        }
                        referralData.push(obj);
                    }
                })
            }

            return res.status(200).send({ status: true, msg: 'Successful', data: referralData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    getReferralHistoriesById: async (req, res) => {
        try {
            const { id } = req.params;

            // const currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            // 3. get the referral history
            const referralHistoryResult = await pool.query(`SELECT * FROM referralhistory WHERE _id=$1 ORDER BY created_at DESC`, [id]);
            let referralHistory = referralHistoryResult.rows[0];

            // 3. get the referree
            const referreResult = await pool.query(`SELECT users_id, username, email FROM users WHERE users_id=$1`, [referralHistory.referree_id]);
            let referres = referreResult.rows[0];

            const obj = {
                _id: referralHistory._id,
                referrerId: referralHistory.referrer_id,
                rewards: referralHistory.rewards,
                type: referralHistory.type,
                createdAt: referralHistory.created_at,
                updatedAt: referralHistory.updated_at,
                currency,
                referreeUsername: referralHistory.referree_username,
                referreeId: {
                    _id: referres.users_id,
                    username: referres.username,
                    email: referres.email
                }
            }
            return res.status(200).send({ status: true, msg: 'Successful', data: obj })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    addReferral: async (req, res) => {
        try {
            await pool.query('BEGIN');
            const userId = req.user
            // 59acccb9fa

            // sanitize all elements from the client, incase of fodgery
            const data = {
                refcode: DOMPurify.sanitize(req.body.refcode),
            }

            // get currency and verifyEmail from config data if exist otherwise set to the one in env
            // get all config
            let config = await pool.query("SELECT * FROM config")
            const startContestReg = config.rows[0].start_contest_reg;

            // get the logged user (referree user)
            const loggedUserData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [userId])
            const loggedUser = loggedUserData.rows[0]

            // get the referrer user using the refcode
            const referrerUserData = await pool.query(`SELECT * FROM users WHERE referral_code=$1`, [data.refcode])
            const referrerUser = referrerUserData.rows[0]

            // check to be sure user has not already been refferred by someone
            if (loggedUser.referrerId) {
                // get the user that referred him prior
                const priorReferrerUserData = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [loggedUser.referrer_id])
                const priorReferrerUser = priorReferrerUserData.rows[0]

                return res.status(400).json({ status: false, msg: `You have already been referred by ${priorReferrerUser.username}` })
            }

            else if (!referrerUser) {
                return res.status(404).json({ status: false, msg: "User not found" })
            }

            else if (loggedUser.referral_code === data.refcode.trim()) {
                return res.status(400).json({ status: false, msg: `Owner's referral code` })
            }

            else {
                // push the loggedUser to the referrerUser's referree list
                await pool.query(`UPDATE users SET referree_id=ARRAY_APPEND(referree_id, $1), updated_at=$2 WHERE referral_code=$3`, [userId, new Date(), data.refcode]);

                // add the referrerUser to the referrerId of the loggedUser
                await pool.query(`UPDATE users SET
                    referrer_id=$1,
                    referrer_username=$2,
                    updated_at=$3
                    WHERE users_id=$4`,
                    [
                        referrerUser.users_id,
                        referrerUser.username,
                        new Date(),
                        userId
                    ]
                )
                // 9bceb2f1df
                // 1be97927d4

                const g = await pool.query(`INSERT INTO
                    referralhistory(
                        _id,
                        referrer_id,
                        referree_username,
                        referree_id
                    )
                    VALUES($1, $2, $3, $4)
                    RETURNING *`,
                    [
                        ran.uuid(),
                        referrerUser.users_id,
                        loggedUser.username,
                        userId
                    ]
                )

                // instantiate Referral Contest collection with the referrer user (he is qualified to be one of the contestant)
                // Only save user to contest if not in before and startContestReg is open
                const referralcontestResult = await pool.query(`SELECT * FROM referralcontest WHERE users_id=$1`, [referrerUser.users_id]);
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
                            referrerUser.users_id,
                        ]
                    )
                }

                await pool.query('COMMIT')
                return res.status(200).json({ status: true, msg: `You have been successfully added to the referree list of ${referrerUser.username}`, data: '' })
            }
        }
        catch (err) {
            await pool.query('REVOKE')
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    getAllReferralContest: async (req, res) => {
        try {
            // get config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            // 3. get the referral history
            const referralContestHistoryResult = await pool.query(`SELECT * FROM referralcontest ORDER BY point DESC, updated_at ASC`);
            let referralContestHistory = referralContestHistoryResult.rows;

            let usersId = [];
            for (let i = 0; i < referralContestHistory.length; i++) {
                usersId.push(referralContestHistory[i].users_id);
            }

            // // 3. get the users
            const usersResult = await pool.query(`SELECT users_id, username, email, referree_id, amount FROM users WHERE users_id=ANY($1)`, [usersId]);
            let users = usersResult.rows;

            let contestData = [];
            for (let i = 0; i < referralContestHistory.length; i++) {

                users.filter(user => {
                    if (referralContestHistory[i].users_id === user.users_id) {

                        const obj = {
                            _id: referralContestHistory[i]._id,
                            rewards: referralContestHistory[i].rewards,
                            paid: referralContestHistory[i].paid,
                            resolved: referralContestHistory[i].resolved,
                            point: referralContestHistory[i].point,
                            position: referralContestHistory[i].position,
                            createdAt: referralContestHistory[i].created_at,
                            updatedAt: referralContestHistory[i].updated_at,
                            currency,
                            userId: {
                                _id: user.users_id,
                                username: user.username,
                                email: user.email,
                                referreeId: user.referree_id,
                                amount: user.amount
                            }
                        }
                        contestData.push(obj);
                    }
                })
            }

            return res.status(200).send({ status: true, msg: 'Successful', data: contestData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message || "Server error, please contact customer support" })
        }
    },

    resetContest: async (req, res) => {
        try {
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            const allowReferralContest = config[0].allow_referral_contest

            const referralContestStarts = config[0].referral_contest_starts

            const referralContestStops = config[0].referral_contest_stops

            const currentTime = Date.now()
            const startsAt = new Date(referralContestStarts).getTime()
            const stopsAt = new Date(referralContestStops).getTime()

            const contestIsOn = currentTime >= startsAt && currentTime <= stopsAt;

            //check if contest is still on, send error
            if (allowReferralContest) {
                return res.status(400).json({ status: false, msg: "Contest is still active, deactivate it before reseting" })
            }

            else if (contestIsOn) {
                return res.status(400).json({ status: false, msg: "Data cannot be reseted when contest is still ongoing, please try again when the contest is over" })
            }
            else {
                await pool.query(`UPDATE referralcontest SET
                    point=$1,
                    rewards=$2,
                    paid=$3,
                    position=$4,
                    resolved=$5,
                    updated_at=$6
                    `,
                    [
                        0, 0, false, null, false, new Date()
                    ]
                )

                return res.status(200).json({ status: true, msg: "Reseted Successfully" })
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    resolveContest: async (req, res) => {
        try {
            let configResult = await pool.query("SELECT * FROM config")
            let config = configResult.rows

            const allowReferralContest = config[0].allow_referral_contest

            const referralContestStarts = config[0].referral_contest_starts

            const referralContestStops = config[0].referral_contest_stops

            const referralContestPrizes = config[0].referral_contest_prizes

            const currentTime = Date.now()
            const startsAt = new Date(referralContestStarts).getTime()
            const stopsAt = new Date(referralContestStops).getTime()

            const contestIsOn = currentTime >= startsAt && currentTime <= stopsAt;

            const dataResult = await pool.query(`SELECT * FROM referralcontest ORDER BY point DESC, updated_at ASC`);
            let data = dataResult.rows;

            // get the users of the length of referralContestPrizes - 1
            const qualifiedUsers = data.slice(0, referralContestPrizes.length);

            //check if contest is still on, send error
            if (!allowReferralContest) {
                return res.status(400).json({ status: false, msg: "Contest is not active" })
            }

            else if (contestIsOn) {
                return res.status(400).json({ status: false, msg: "Contest is still on going, try again later" })
            }

            else {
                // otherwise pay users

                //loop through referralContestPrizes and get each price together with the users of the length of the referralContestPrizes
                for (let i = 0; i < referralContestPrizes.length; i++) {
                    if (qualifiedUsers[i] && !qualifiedUsers[i].paid && qualifiedUsers[i].point > 0) {
                        await pool.query(`UPDATE referralcontest SET
                            rewards=$1,
                            paid=$2,
                            position=$3,
                            updated_at=$4
                            WHERE users_id=$5
                            `,
                            [
                                referralContestPrizes[i],
                                true,
                                Number(i) + 1,
                                new Date(),
                                qualifiedUsers[i].userId
                            ]
                        )
                    }
                }

                // find those that were paid (those that were qualified) in the User database and update their account balance
                const contestantsData = await pool.query(`SELECT * FROM referralcontest WHERE paid=$1`, [true])
                const contestants = contestantsData.rows

                for (let contestant of contestants) {
                    if (!contestant.resolved) {
                        await pool.query(`UPDATE users SET
                            amount=amount + $1,
                            referral_contest_rewards=referral_contest_rewards + $2,
                            updated_at=$3
                            WHERE users_id=$4`,
                            [
                                contestant.rewards.toFixed(8),
                                contestant.rewards.toFixed(8),
                                new Date(),
                                contestant.users_id
                            ]
                        )

                        await pool.query(`UPDATE referralcontest SET
                            resolved=$1,
                            updated_at=$2
                            WHERE _id=$3
                            `,
                            [
                                true,
                                new Date(),
                                contestant._id
                            ]
                        )
                    }
                }
                return res.status(200).json({ status: true, msg: "Rewarded Successfully" })
            }

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    removeUserFromContest: async (req, res) => {
        try {
            const { id } = req.params;

            // get config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            // remove the collection with this id
            await pool.query(`DELETE FROM referralcontest WHERE _id=$1`, [id]);

            const data = await Contest.find({}).populate({ path: 'userId', select: ['_id', 'email', 'username', 'referree'] }).sort({ point: -1, updatedAt: 1 });

            // 3. get the referral history
            const referralContestHistoryResult = await pool.query(`SELECT * FROM referralcontest ORDER BY point DESC, updated_at ASC`);
            let referralContestHistory = referralContestHistoryResult.rows;

            let usersId = [];
            for (let i = 0; i < referralContestHistory.length; i++) {
                usersId.push(referralContestHistory[i].users_id);
            }

            // // 3. get the users
            const usersResult = await pool.query(`SELECT users_id, username, email, referree_id, amount FROM users WHERE users_id=ANY($1)`, [usersId]);
            let users = usersResult.rows;

            let contestData = [];
            for (let i = 0; i < referralContestHistory.length; i++) {
                users.filter(user => {
                    if (referralContestHistory[i].users_id === user.users_id) {
                        const obj = {
                            _id: referralContestHistory[i]._id,
                            rewards: referralContestHistory[i].rewards,
                            paid: referralContestHistory[i].paid,
                            resolved: referralContestHistory[i].resolved,
                            point: referralContestHistory[i].point,
                            position: referralContestHistory[i].position,
                            createdAt: referralContestHistory[i].created_at,
                            updatedAt: referralContestHistory[i].updated_at,
                            currency,
                            userId: {
                                _id: user.users_id,
                                username: user.username,
                                email: user.email,
                                referreeId: user.referree_id,
                                amount: user.amount
                            }
                        }
                        contestData.push(obj);
                    }
                })
            }

            return res.status(200).json({ status: true, msg: "Removed Successfully", data: contestData })
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },
}
