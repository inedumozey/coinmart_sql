const tables = {
    createUser: `CREATE TABLE users(
        users_id UUID PRIMARY KEY,
        username VARCHAR(250) NOT NULL UNIQUE,
        email VARCHAR(250) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        amount FLOAT DEFAULT 0,
        account_number VARCHAR(12) NOT NULL UNIQUE,
        role VARCHAR(12) DEFAULT 'USER',
        is_supper_admin BOOLEAN DEFAULT 'false',
        verify_email_token VARCHAR(250) UNIQUE,
        is_verified BOOLEAN DEFAULT 'false',
        is_blocked BOOLEAN DEFAULT 'false',
        has_invested BOOLEAN DEFAULT 'false',
        investment_count INT DEFAULT 0,
        referral_contest_rewards FLOAT DEFAULT 0,
        referral_code VARCHAR(10) NOT NULL UNIQUE,
        referrer_username VARCHAR(250),
        referrer_id VARCHAR(50),
        referree_id VARCHAR[],
        profile_pic_url VARCHAR(250) DEFAULT 'https://api.multiavatar.com/popo.svg',
        profile_pic_public_Id VARCHAR(250),
        twofa VARCHAR(50),
        phone VARCHAR(15) NOT NULL,
        country VARCHAR(50) NOT NULL,
        address VARCHAR(300) NOT NULL,
        new_notifications VARCHAR[],
        read_notifications VARCHAR[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    createPasswordToken: `CREATE TABLE passwordtoken(
        _id UUID PRIMARY KEY,
        token VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        users_id UUID,
        FOREIGN KEY(users_id) REFERENCES users(users_id) ON DELETE CASCADE
    )`,

    createreferralHistory: `CREATE TABLE referralhistory(
        _id UUID PRIMARY KEY,
        referrer_id UUID,
        referree_id UUID,
        referree_username VARCHAR(250),
        rewards FLOAT DEFAULT 0,
        type VARCHAR(30) DEFAULT 'referral',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(referrer_id) REFERENCES users(users_id) ON DELETE SET NULL,
        FOREIGN KEY(referree_id) REFERENCES users(users_id) ON DELETE SET NULL
    )`,

    createContest: `CREATE TABLE referralcontest(
        _id UUID PRIMARY KEY,
        users_id UUID,
        point FLOAT DEFAULT 0,
        rewards FLOAT DEFAULT 0,
        paid BOOLEAN DEFAULT 'false',
        resolved BOOLEAN DEFAULT 'false',
        position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(users_id) REFERENCES users(users_id) ON DELETE CASCADE
    )`,

    createDeposit: `CREATE TABLE deposit(
        _id UUID PRIMARY KEY,
        users_id UUID,
        code VARCHAR(20),
        link VARCHAR(250),
        amount_expected FLOAT,
        amount_received FLOAT,
        over_payment_threshold FLOAT,
        under_payment_threshold FLOAT,
        over_paid_by FLOAT DEFAULT 0,
        under_paid_by FLOAT DEFAULT 0,
        status VARCHAR(25) DEFAULT 'charge created',
        comment VARCHAR(25) DEFAULT 'created',
        transaction_type VARCHAR(30) DEFAULT 'deposit',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(users_id) REFERENCES users(users_id) ON DELETE CASCADE
    )`,

    createWithdrawal: `CREATE TABLE withdrawal(
        _id UUID PRIMARY KEY,
        users_id UUID,
        wallet_address VARCHAR(200) NOT NULL,
        coin VARCHAR(15) NOT NULL,
        amount FLOAT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_type VARCHAR(30) DEFAULT 'withdrawal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(users_id) REFERENCES users(users_id) ON DELETE CASCADE
    )`,

    createWebsiteConfig: `CREATE TABLE config(
        _id UUID PRIMARY KEY,
        unverified_user_lifespan INT DEFAULT 0,
        total_members INT DEFAULT 0,
        total_investors INT DEFAULT 0,
        members_country INT DEFAULT 0,
        total_withdrawal FLOAT DEFAULT 0,
        total_deposit FLOAT DEFAULT 0,
        admin_password VARCHAR(200),
        currency VARCHAR(12) DEFAULT 'USD',
        allow_transfer BOOLEAN DEFAULT 'false',
        allow_withdrawal BOOLEAN DEFAULT 'false',
        allow_investment BOOLEAN DEFAULT 'false',
        investment_limits INT DEFAULT 2,
        referral_bonus_percentage FLOAT DEFAULT 10,
        referral_bonus_limit INT DEFAULT 1,
        referral_contest_percentage FLOAT DEFAULT 0,
        allow_referral_contest BOOLEAN DEFAULT 'false',
        start_contest_reg BOOLEAN DEFAULT 'false',
        referral_contest_starts VARCHAR(200) DEFAULT '2023-06-01T00:00',
        referral_contest_stops VARCHAR(200) DEFAULT '2023-06-01T00:00',
        referral_contest_prizes FLOAT[],
        min_withdrawable_limit FLOAT DEFAULT 0,
        max_withdrawable_limit FLOAT DEFAULT 0,
        withdrawable_common_diff FLOAT DEFAULT 0,
        withdrawable_factors FLOAT[],
        withdrawable_coins VARCHAR[],
        min_transferable_limit FLOAT DEFAULT 0,
        max_transferable_limit FLOAT DEFAULT 0,
        transferable_common_diff FLOAT DEFAULT 0,
        transferable_factors FLOAT[],
        pending_withdrawal_duration INT DEFAULT 24,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    createTestimonials: `CREATE TABLE testimonials(
        _id UUID PRIMARY KEY,
        name VARCHAR(150) DEFAULT 'Anonymous',
        body VARCHAR(500) NOT NULL,
        removed BOOLEAN DEAFULT 'false',
        avatar VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    createInternalTransfer: `CREATE TABLE internaltransfer(
        _id UUID PRIMARY KEY,
        sender_id UUID,  
        sender_username VARCHAR(250),
        receiver_id UUID,
        receiver_username VARCHAR(250),
        account_number VARCHAR(12) NOT NULL,
        amount FLOAT NOT NULL,
        status VARCHAR(12) DEFAULT 'Successful',
        transaction_type VARCHAR(30) DEFAULT 'transfer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(users_id) ON DELETE SET NULL,
        FOREIGN KEY(receiver_id) REFERENCES users(users_id) ON DELETE SET NULL
    )`,

    createInvestmentPlan: `CREATE TABLE investmentplan(
        _id UUID PRIMARY KEY,
        type VARCHAR(100) NOT NULL UNIQUE,
        return_percentage FLOAT NOT NULL,
        point FLOAT NOT NULL,
        lifespan INT NOT NULL,
        min_amount FLOAT DEFAULT 0,
        max_amount FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    createInvestment: `CREATE TABLE investment(
        _id UUID PRIMARY KEY,
        users_id UUID,
        type VARCHAR(100) NOT NULL,
        return_percentage FLOAT NOT NULL,
        lifespan INT NOT NULL,
        amount FLOAT NOT NULL,
        rewards FLOAT DEFAULT 0,
        rewarded BOOLEAN DEFAULT 'false',
        is_active BOOLEAN DEFAULT 'true',
        status VARCHAR(12) DEFAULT 'active',
        transaction_type VARCHAR(30) DEFAULT 'investment',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(users_id) REFERENCES users(users_id) ON DELETE CASCADE
    )`,

    createNotification: `CREATE TABLE notifications(
        _id UUID PRIMARY KEY,
        subject VARCHAR(300),
        text VARCHAR(2000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

}


module.exports = tables;