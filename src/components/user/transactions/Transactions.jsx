import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import apiClass from '../../../utils/api';
import Cookies from 'js-cookie';
import filter from "@mozeyinedu/filter";
import { useSnap } from '@mozeyinedu/hooks-lab';
import Spinner_ from '../../spinner/Spinner';
import Skeletons from './Skeletons';
import Card from './Card';

const api = new apiClass()

export default function Transactions({ selectedUser }) {
    const { snap } = useSnap(.5)
    const { user, num, fetchDataErrorMsg, noDataMsg } = useContext(Context);

    const [inp, setInp] = useState('')
    const [load, setLoading] = useState(true);

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);

    const {
        setUserDataSuccess_user,
        setUserData_user,
        setFetchingUserData_user,
        userDataSuccess_user,
        userData_user,
        fetchingUserData_user,

    } = user.userHistory;

    const { profileData } = user.profile;

    const [filteredData, setFilter] = useState(userData_user);

    useEffect(() => {
        const newData = filter({
            data: userData_user,
            keys: [
                'code',
                "amountExpected",
                "amountReceived",
                "link",
                "comment",
                "username",
                "email",
                'walletAddress',
                "amount",
                "coin",
                "status",
                "senderUsername",
                "senderId",
                "receiverId",
                'transactionType',
                "receiverUsername",
                "_id"
            ],
            input: inp
        })

        setFilter(newData)

    }, [inp, userData_user])

    const handleViewMore = () => {
        setOpening(true)

        setTimeout(() => {
            setOpening(false)
            setCount(prevState => prevState + num)
        }, 1000)
    }

    useEffect(() => {
        setFetchingUserData_user(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchUserHistory_user(setUserData_user, setFetchingUserData_user, setUserDataSuccess_user)
            }, 3000);
        }
        else {
            setTimeout(() => {
                api.fetchUserHistory_user(setUserData_user, setFetchingUserData_user, setUserDataSuccess_user)
            }, 2000)
        }
    }, [selectedUser]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    return (
        <Wrapper>

            {
                load || fetchingUserData_user ?
                    <Skeletons /> :

                    !userDataSuccess_user ?
                        <div className="tag-error">{fetchDataErrorMsg}</div> :
                        userData_user.length < 1 ?
                            <div className="tag-error">{noDataMsg}</div> :
                            <>
                                <div className="header">
                                    <div className="stat-wrapper">
                                        {/* deposit */}
                                        <div className="stat margin">
                                            <div>
                                                <span className='deposit'>Deposit</span><sup style={{ color: 'red', fontSize: '.8rem' }}>
                                                    {(userData_user?.filter(data => data.transactionType?.toLowerCase() === 'deposit')).length}</sup>
                                                {
                                                    // show deposit statistic if not empty
                                                    (userData_user?.filter(data => data.transactionType?.toLowerCase() === 'deposit')).length ?
                                                        <div className="sub-stat">
                                                            <div className="stat">
                                                                <div className='pending'>Initiated: {(userData_user?.filter(data => data.status?.toLowerCase() === 'charge-created')).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='pending'>Pending: {(userData_user?.filter(data => data.status?.toLowerCase() === 'charge-pending')).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='confirmed'>Confirmed: {(userData_user?.filter(data => data.status?.toLowerCase() === 'charge-confirmed')).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='failed'>Failed/Canceled: {(userData_user?.filter(data => data.status?.toLowerCase() === 'charge-failed')).length}</div>
                                                            </div>
                                                        </div> : ''
                                                }
                                            </div>
                                        </div>

                                        {/* withdrawal */}
                                        <div className="stat margin">
                                            <div>
                                                <span className='withdrawal'>Withdrawal</span><sup style={{ color: 'red', fontSize: '.8rem' }}>
                                                    {(userData_user?.filter(data => data.transactionType?.toLowerCase() === 'withdrawal')).length}</sup>
                                                {
                                                    // show deposit statistic if not empty
                                                    (userData_user?.filter(data => data.transactionType?.toLowerCase() === 'withdrawal')).length ?
                                                        <div className="sub-stat">
                                                            <div className="stat">
                                                                <div className='pending'>Pending:  {(userData_user?.filter(data => data.status?.toLowerCase() === 'pending')).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='confirmed'>Confirmed: {(userData_user?.filter(data => data.status?.toLowerCase() === 'confirmed')).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='failed'>Rejected: {(userData_user?.filter(data => data.status?.toLowerCase() === 'rejected')).length}</div>
                                                            </div>
                                                        </div> : ''
                                                }
                                            </div>
                                        </div>

                                        {/* transfer */}
                                        <div className="stat margin">
                                            <div>
                                                <span className='transfer'>Transfer</span><sup style={{ color: 'red', fontSize: '.8rem' }}>
                                                    {(userData_user?.filter(data => data.transactionType?.toLowerCase() === 'transfer')).length}</sup>
                                                {
                                                    // show deposit statistic if not empty
                                                    (userData_user?.filter(data => data.transactionType?.toLowerCase() === 'transfer')).length ?
                                                        <div className="sub-stat">
                                                            <div className="stat">
                                                                <div className='sent'>Sent: {(userData_user?.filter(data => data.senderUsername === profileData.username)).length}</div>
                                                            </div>

                                                            <div className="stat">
                                                                <div className='confirmed'>Received: {(userData_user?.filter(data => data.receiverUsername === profileData.username)).length}</div>
                                                            </div>
                                                        </div> : ''
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <div className="search-wrapper">
                                        <div className="search">
                                            <input
                                                placeholder='Search by Amount, Transaction Type, Status etc'
                                                value={inp || ''}
                                                onChange={(e) => setInp(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <SubWrapper>
                                    {filteredData?.slice(0, count).map((data, i) => {
                                        return (
                                            <Card
                                                key={i}
                                                data={data}
                                                profileData={profileData}
                                            />
                                        )
                                    })}

                                </SubWrapper>

                                {
                                    count >= filteredData.length ? '' :

                                        <ViewMore>

                                            <div onClick={handleViewMore} className="more" {...snap()}>
                                                {opening ? <div className='center'> <Spinner_ size="sm" /></div> : 'View more...'}
                                            </div>
                                        </ViewMore>
                                }
                            </>
            }

        </Wrapper>
    )
}


const Wrapper = styled.div`
    margin: auto;
    font-size: .8rem;

    padding: 10px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 10px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 10px ${({ theme }) => theme.sm_padding};
    }

    .tag { 
        font-weight: bold;
        margin-bottom: 20px;
        color: var(--blue);
    }
    .tag-error {
        font-size: .65rem;
        color: red;
    }

    .transfer {
        color: var(--blue-deep);
        font-weight: bold;
        font-size: .8rem;
    };
    .deposit {
        color: var(--green);
        font-weight: bold;
        font-size: .8rem;
    };
    .withdrawal {
        color: var(--pink);
        font-weight: bold;
        font-size: .8rem;
    };

    .confirmed {
        color: var(--blue);
    }
    .failed {
        color: red;
    }

    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }
        .stat-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 5px;
        }
        .margin {
            margin-right: 5px;
            // border-left: 1px solid #ccc;
        }
        .sub-stat {
            margin-left: 10px;
            border-left: 1px solid #ccc;
            padding-left: 2px;

            .stat {
                font-size: .8rem;
            }
        }

        .search {
            display: inline-block;
            margin-bottom: 10px;
            width: 40%;
            max-width: 300px;
            min-width: 200px;
    
            input {
                padding: 6px;
                border-radius: 5px;
                width: 100%;
                border: 1px solid #ccc;
        
                &: focus {
                    outline: none;
                }
            }
        }
    }
`

const SubWrapper = styled.div`
    margin: auto;
    display: flex;
    font-size: .8rem;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`

const ViewMore = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;

    .more{
        user-select: none;
       
        -webkit-user-select: none;
        font-size: .7rem;
        cursor: pointer;
        border: 1px solid;
        border-radius: 5px;
        padding: 7px;

        &:hover{
            opacity: .3
        }
    }
`
