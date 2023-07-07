import React, { useContext } from 'react'
import { Context } from '../../context/Context';

export default function MoreInfo() {
    const { contact } = useContext(Context);

    return (
        <div style={{ padding: '0 20px' }}>
            <p>Aside the 10% Referral bonuses for inviting a user, We Added extra prices in contest to be won according to your efforts and number of Active downlines!</p>

            <p>The Referral Ranking consist of prizes attached to be won by highest generating number of referrals on a weekly/timely bases.</p>

            <p>The rewards will be distributed accordingly, calculated based on highest point and commission.</p>

            <p>The Prices for the Bonus are not static, as it can be increased or reduced depending on the competitive rate. You can always check the referral Ranking Page to see the Rewards, basically Top 10 users will be rewarded According to their position, which is differentiated and Ranked according to points</p>

            <p>Here’s a Breakdown of how the Points are distributed.</p>

            <ul>
                <li>3k Plan - 0.1 Point</li>
                <li>5k plan - 0.2 Points</li>
                <li>10k plan - 0.3 points</li>
                <li>20k plan - 0.5 points</li>
                <li>50k plan - 1 point</li>
                <li>100k plan - 2 points</li>
                <li>200k+ plan - 0.3 points (generated 14 times of investment)</li>
            </ul>

            <p>The Points are subject to first Investment from your Referrals Only.</p>

            <p>The Reward are distributed 24 hours after the Contest Ends.</p>

            <p>Show off your Influence, and Earn amazing Rewards!</p>

            <p>⚠️ Self Referring or multiple accounts, will only result in disqualification and further deactivation of all your accounts!</p>

            <p>
                Happy Investing! <br />
                <span style={{ fontStyle: 'italic', color: '#aaa' }}> {contact.name} {contact.investment} </span>
            </p>
        </div>
    )
}
