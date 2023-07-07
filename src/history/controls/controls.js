require("dotenv").config();
const pool = require('../../db/conn')


module.exports = {

    userAdmin: async (req, res) => {
        try {
            const { id } = req.params;

            // get currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            const history = { profile: '', deposit: '', referral: '', withdrawal: '', investment: '', transfer: '' }

            // 1. get the profile
            const { rows } = await pool.query(`SELECT * FROM users WHERE users_id=$1`, [id]);
            let user = rows[0];

            if (!user) res.status(404).json({ status: false, msg: `User not found!` })

            else {
                // 1==> get the referrer
                let referrerResults = await pool.query(`SELECT * FROM users WHERE users_id = $1`, [user.referrer_id]);
                let referrerUsers = referrerResults.rows[0]
                referrerUsers = !referrerUsers ? null : {
                    _id: referrerUsers.users_id,
                    email: referrerUsers.email,
                    username: referrerUsers.username,
                    hasInvested: referrerUsers.has_invested
                }

                // 2==> get the referrees
                let referreeUsersArr = []
                let referreeResults = await pool.query(`SELECT * FROM users WHERE users_id =ANY($1)`, [user.referree_id]);
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

                // 3==> get all new notifications
                let newNotificationsArr = []
                let newNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [user.new_notifications]);
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

                // 4==> get all read notifications
                let readNotificationsArr = []
                let readNotificationsResults = await pool.query(`SELECT * FROM notifications WHERE _id = ANY($1)`, [user.read_notifications]);
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

                // 5==> get the user 
                user.referree_id = referreeUsersArr;
                user.referrer_id = referrerUsers;
                user.newNotifications = newNotificationsArr;
                user.readNotifications = readNotificationsArr;
                user.password = null;

                let obj = {
                    _id: user.users_id,
                    username: user.username,
                    email: user.email,
                    amount: user.amount,
                    currency,
                    accountNumber: user.account_number,
                    role: user.role,
                    isSupperAdmin: user.is_supper_admin,
                    verifyEmailToken: user.verify_email_token,
                    isVerified: user.is_verified,
                    isBlocked: user.is_blocked,
                    hasInvested: user.has_invested,
                    investmentCount: user.investment_count,
                    referralContestRewards: user.referral_contest_rewards,
                    referralCode: user.referral_code,
                    referreeId: user.referree_id,
                    referrerId: user.referrer_id,
                    referrerUsername: user.referrer_username,
                    newNotifications: user.newNotifications,
                    readNotifications: user.readNotifications,
                    profilePicUrl: user.profile_pic_url,
                    profilePicPublicId: user.profile_pic_public_id,
                    twofa: user.twofa,
                    phone: user.phone,
                    country: user.country,
                    address: user.address,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                }
                history.profile = obj;

                // 6==> get the referral history
                const referralHistoryResult = await pool.query(`SELECT * FROM referralhistory WHERE referrer_id=$1`, [id]);
                let referralHistory = referralHistoryResult.rows;
                const referree_id = []
                for (let i = 0; i < referralHistory.length; i++) {
                    referree_id.push(referralHistory[i].referree_id);
                }

                let referralData = []
                for (let i = 0; i < referralHistory.length; i++) {
                    const obj = {
                        _id: referralHistory[i]._id,
                        referrerId: referralHistory[i].referrer_id,
                        referreeId: referralHistory[i].referree_id,
                        referreeUsername: referralHistory[i].referree_username,
                        rewards: referralHistory[i].rewards,
                        hasInvested: referralHistory[i].has_invested,
                        type: referralHistory[i].type,
                        createdAt: referralHistory[i].created_at,
                        updatedAt: referralHistory[i].updated_at,
                        currency,
                    }
                    referralData.push(obj)
                }

                history.referral = referralData;

                // 7==> get deposit
                // get deposit hx from the database
                const depositHxResult = await pool.query(`SELECT * FROM deposit WHERE users_id=$1 ORDER BY created_at DESC`, [user.users_id]);
                const depositHx = depositHxResult.rows;

                let depositHxData = []
                for (let i = 0; i < depositHx.length; i++) {
                    let obj = {
                        _id: depositHx[i]._id,
                        code: depositHx[i].code,
                        link: depositHx[i].link,
                        amountExpected: depositHx[i].amount_expected,
                        amountReceived: depositHx[i].amount_received,
                        overPaymentThreshold: depositHx[i].over_payment_threshold,
                        underPaymentThreshold: depositHx[i].under_payment_threshold,
                        overPaidBy: depositHx[i].over_paid_by,
                        underPaidBy: depositHx[i].under_paid_by,
                        status: depositHx[i].status,
                        comment: depositHx[i].comment,
                        transactionType: depositHx[i].transaction_type,
                        createdAt: depositHx[i].created_at,
                        updatedAt: depositHx[i].updated_at,
                        currency,
                        userId: {
                            _id: user.users_id,
                            email: user.email,
                            username: user.username,
                            role: user.role,
                        }
                    }
                    depositHxData.push(obj)
                }
                history.deposit = depositHxData;

                // 8==> get withdrawal
                // get withdrawal hx from the database
                const withdrawalHxResult = await pool.query(`SELECT * FROM withdrawal WHERE users_id=$1 ORDER BY created_at DESC`, [user.users_id]);
                const withdrawalHx = withdrawalHxResult.rows;

                let withdrawalHxData = []
                for (let i = 0; i < withdrawalHx.length; i++) {
                    let obj = {
                        _id: withdrawalHx[i]._id,
                        walletAddress: withdrawalHx[i].wallet_address,
                        coin: withdrawalHx[i].coin,
                        amount: withdrawalHx[i].amount,
                        status: withdrawalHx[i].status,
                        transactionType: withdrawalHx[i].transaction_type,
                        createdAt: withdrawalHx[i].created_at,
                        updatedAt: withdrawalHx[i].updated_at,
                        currency,
                        userId: {
                            _id: user.users_id,
                            email: user.email,
                            username: user.username,
                            role: user.role,
                        }
                    }
                    withdrawalHxData.push(obj)
                }
                history.withdrawal = withdrawalHxData;

                // 8==> get transfer
                // get transfer hx from the database
                const transferHxResult = await pool.query(`SELECT * FROM internaltransfer WHERE sender_id=$1 OR receiver_id=$2 ORDER BY created_at DESC`, [user.users_id, user.users_id]);
                const transferHx = transferHxResult.rows;

                let transferHxData = []
                for (let i = 0; i < transferHx.length; i++) {
                    // get the sender id
                    let obj = {
                        _id: transferHx[i]._id,
                        amount: transferHx[i].amount,
                        status: transferHx[i].status,
                        transactionType: transferHx[i].transaction_type,
                        createdAt: transferHx[i].created_at,
                        updatedAt: transferHx[i].updated_at,
                        accountNumber: transferHx[i].account_number,
                        receiverUsername: transferHx[i].receiver_username,
                        senderUsername: transferHx[i].sender_username,
                        currency,
                        senderId: transferHx[i].sender_id,
                        // senderId: { _id: '', email: '', username: '', accountNumber: '' },
                        receiverId: transferHx[i].receiver_id,
                        // receiverId: { _id: '', email: '', username: '', accountNumber: '' }
                    }


                    transferHxData.push(obj)
                }
                history.transfer = transferHxData;

                // 9==> get investment
                // get investment hx from the database
                const investmentHxResult = await pool.query(`SELECT * FROM investment WHERE users_id=$1 ORDER BY created_at DESC`, [user.users_id]);
                const investmentHx = investmentHxResult.rows;

                let investmentHxData = []
                for (let i = 0; i < investmentHx.length; i++) {
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
                        comment: investmentHx[i].comment,
                        transactionType: investmentHx[i].transaction_type,
                        createdAt: investmentHx[i].created_at,
                        updatedAt: investmentHx[i].updated_at,
                        currency,
                        userId: {
                            _id: user.users_id,
                            email: user.email,
                            username: user.username,
                            role: user.role,
                        }
                    }
                    investmentHxData.push(obj)
                }
                history.investment = investmentHxData;


                return res.status(200).json({ status: false, msg: "Sucessful", data: history });
            }
        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    },

    user: async (req, res) => {
        try {
            const userId = req.user

            // get currency from config
            let configResult = await pool.query("SELECT currency FROM config")
            let { currency } = configResult.rows[0]

            let data = []

            // 2. get the deposit
            const depositData = await pool.query(`SELECT * FROM deposit WHERE users_id=$1 ORDER BY updated_at DESC`, [userId]);
            const depositArr = depositData.rows

            const deposit = []
            for (let i = 0; i < depositArr.length; i++) {
                let obj = {
                    _id: depositArr[i]._id,
                    code: depositArr[i].code,
                    link: depositArr[i].link,
                    amountExpected: depositArr[i].amount_expected,
                    amountReceived: depositArr[i].amount_received,
                    overPaymentThreshold: depositArr[i].over_payment_threshold,
                    underPaymentThreshold: depositArr[i].under_payment_threshold,
                    overPaidBy: depositArr[i].over_paid_by,
                    underPaidBy: depositArr[i].under_paid_by,
                    status: depositArr[i].status,
                    comment: depositArr[i].comment,
                    transactionType: depositArr[i].transaction_type,
                    createdAt: depositArr[i].created_at,
                    updatedAt: depositArr[i].updated_at,
                    currency,
                    userId: depositArr[i].users_id,
                }
                deposit.push(obj)
            }

            // 4. get the withdrawal history
            const withdrawalData = await pool.query(`SELECT * FROM withdrawal WHERE users_id=$1 ORDER BY updated_at DESC`, [userId]);
            const withdrawalArr = withdrawalData.rows

            const withdrawal = []
            for (let i = 0; i < withdrawalArr.length; i++) {
                let obj = {
                    _id: withdrawalArr[i]._id,
                    walletAddress: withdrawalArr[i].wallet_address,
                    coin: withdrawalArr[i].coin,
                    amount: withdrawalArr[i].amount,
                    status: withdrawalArr[i].status,
                    transactionType: withdrawalArr[i].transaction_type,
                    createdAt: withdrawalArr[i].created_at,
                    updatedAt: withdrawalArr[i].updated_at,
                    currency,
                    userId: withdrawalArr[i].users_id,
                }
                withdrawal.push(obj)
            }

            // 5. get the transfer history
            const transferData = await pool.query(`SELECT * FROM internaltransfer WHERE sender_id=$1 OR receiver_id=$2 ORDER BY created_at DESC`, [userId, userId]);
            const transferArr = transferData.rows

            const transfer = []
            for (let i = 0; i < transferArr.length; i++) {
                let obj = {
                    _id: transferArr[i]._id,
                    amount: transferArr[i].amount,
                    status: transferArr[i].status,
                    transactionType: transferArr[i].transaction_type,
                    createdAt: transferArr[i].created_at,
                    updatedAt: transferArr[i].updated_at,
                    accountNumber: transferArr[i].account_number,
                    receiverUsername: transferArr[i].receiver_username,
                    senderUsername: transferArr[i].sender_username,
                    currency,
                    senderId: transferArr[i].sender_id,
                    receiverId: transferArr[i].receiver_id,
                }
                transfer.push(obj)
            }

            data = [...deposit, ...withdrawal, ...transfer];

            // sort data base on time
            const sortedData = data.sort((a, b) => {
                if (a.createdAt > b.createdAt) return -1
                if (a.createdAt < b.createdAt) return 1
                if (a.createdAt == b.createdAt) return 0
            })

            return res.status(200).json({ status: false, msg: "Sucessful", data: sortedData })

        }
        catch (err) {
            return res.status(500).json({ status: false, msg: err.message })
        }
    }
}