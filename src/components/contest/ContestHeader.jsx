import React from 'react'
import CountdownTimer from './CountdownTimer';

export default function ContestHeader({ data, config }) {
    return (
        <div>
            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total Contestants: <span style={{ color: 'red' }}>{data.length}</span></div>
                    </div>
                    {
                        !config.configData.allowReferralContest ? <div className="tag">Contest is currently not available</div> :
                            <div className="stat">
                                <div>Contest Starts At: {config.configData && new Date(config.configData.referralContestStarts).toLocaleString()}</div>
                                <div>Contest Stops At: {config.configData && new Date(config.configData.referralContestStops).toLocaleString()}</div>
                                <CountdownTimer stopDate={config.configData.referralContestStops} startDate={config.configData.referralContestStarts} />
                            </div>
                    }
                </div>
            </div>

        </div>
    )
}
