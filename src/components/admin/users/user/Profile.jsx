import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default function Profile({ data }) {

    return (
        <Wrapper>
            <div className="user img">
                <img src={data.profilePicUrl} alt="profile image" />
            </div>

            <div className='user'>
                <span className="name">Username: </span>
                <span className="value">{data.username}</span>
            </div>

            <div className='user'>
                <span className="name">Email: </span>
                <span className="value">{data.email}</span>
            </div>

            <div className='user'>
                <span className="name">Member Since: </span>
                <span className="value"> {data.createdAt && new Date(data.createdAt).toLocaleString()}</span>
            </div>

            <div className='user'>
                <span className="name">Acct Bal: </span>
                <span className="value">{data.amount} {data.currency}</span>
            </div>

            <div className='user'>
                <span className="name">Acct No: </span>
                <span className="value">{data.accountNumber} </span>
            </div>
            <div className='user'>
                <span className="name">Referral Code: </span>
                <span className="value">{data.referralCode} </span>
            </div>
            <div className='user'>
                <span className="name">Investment: </span>
                <span className="value">{data.investmentCount} </span>
            </div>
            <div className='user'>
                <span className="name">Role: </span>
                <span className="value"
                    style={
                        (function () {
                            if (data.role == 'AMDIN' && !data.isSupperAdmin) {
                                return { color: 'var(--blue)' }
                            }
                            if (data.role == 'ADMIN' && data.isSupperAdmin) {
                                return { color: 'red' }
                            }
                            else {
                                return { color: 'inherit' }
                            }
                        }())
                    }>{data.isSupperAdmin ? `SUPER ADMIN` : data.role}</span>
            </div>
            <div className='user'>
                {
                    data.referrerUsername ?
                        data.referrerId ?
                            <Link style={{ textDecoration: 'none' }} to={`/admin/users/${data.referrerId._id}`}>
                                <span className="name">Referred By: </span>
                                <span className="value">{data.referrerUsername} </span>
                            </Link> :
                            <div style={{ textDecoration: 'none' }}>
                                <span className="name">Referred By: </span>
                                <span className="value">{data.referrerUsername} </span>
                            </div>
                        : ''
                }

            </div>
            <div className='user'>
                <span className="name">Referral Contest Rewards: </span>
                <span className="value"><span style={{ color: 'red' }}>{data.referralContestRewards} {data.currency}</span></span>
            </div>

            {
                data.isBlocked ? <div style={{ marginTop: '20px' }} className='user'>
                    <div className="name" style={{ color: 'red' }}>User Account is Deactivated</div>
                </div> : ''
            }

        </Wrapper>
    )
}

const Wrapper = styled.div`

    .img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid #ccc;
        object-fit: contain;
        position: relative;

        @media (max-width: ${({ theme }) => theme.sm_screen}){
            margin: auto;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    
    .user {
        margin-bottom: 10px;
        .name {
            font-weight: bold;
        }
    }
`
