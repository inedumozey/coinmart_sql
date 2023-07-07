import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import apiClass from '../../../../utils/api';
import Skeleton from '../../../Skeleton';
import Cookies from 'js-cookie'
import TransferHx from './TransferHx';
import WithdrawalHx from './WithdrawalHx';
import InvestmentHx from './InvestmentHx';
import DepositHx from './DepositHx';
import Profile from './Profile';
import ReferralHx from './ReferralHx';
import Actions from './Actions';


const api = new apiClass()


export default function User({ selectedUser }) {
    const { admin, config } = useContext(Context);

    const [load, setLoading] = useState(true)

    const {
        fetchingUserData_admin,
        userDataSuccess_admin,
        setFetchingUserData_admin,
        setUserDataSuccess_admin,
        userData_admin,
        setUserData_admin,
    } = admin.userHistory;

    useEffect(() => {
        setFetchingUserData_admin(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchUserHistory_admin(selectedUser, setUserData_admin, setFetchingUserData_admin, setUserDataSuccess_admin)
            }, 3000);
        }
        else {
            setTimeout(() => {
                api.fetchUserHistory_admin(selectedUser, setUserData_admin, setFetchingUserData_admin, setUserDataSuccess_admin)
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
                fetchingUserData_admin || load || !config.configData ?
                    <Skeletons>
                        {
                            [1, 2, 3, 4].map((item, i) => {
                                return <SubWrapper key={i} className='user'>
                                    <div className="type"><Skeleton /></div>
                                </SubWrapper>
                            })
                        }
                    </Skeletons> :

                    !userDataSuccess_admin ?
                        <div className="tag-error">Faild to fetch data, please refresh the brouser</div> :
                        <>
                            <SubWrapper>
                                <Profile data={userData_admin.profile} type="profile" />
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Deposit History</div>
                                {
                                    !userData_admin.deposit.length ?
                                        <div className="tag-error">Empty</div> :
                                        <DepositHx selectedUser={selectedUser} data={userData_admin.deposit} type="deposit" />
                                }
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Referral History</div>
                                {
                                    !userData_admin.referral.length ?
                                        <div className="tag-error">Empty</div> :
                                        <ReferralHx data={userData_admin.referral} type="referral" />
                                }
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Investment History</div>
                                {
                                    !userData_admin.investment.length ?
                                        <div className="tag-error">Empty</div> :
                                        <InvestmentHx selectedUser={selectedUser} data={userData_admin.investment} type="investment" />
                                }
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Withdrawal Histroy</div>
                                {
                                    !userData_admin.withdrawal.length ?
                                        <div className="tag-error">Empty</div> :
                                        <WithdrawalHx selectedUser={selectedUser} data={userData_admin.withdrawal} type="withdrawal" />
                                }
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Transfer History</div>
                                {
                                    !userData_admin.transfer.length ?
                                        <div className="tag-error">Empty</div> :
                                        <TransferHx data={userData_admin.transfer} type="transfer" />
                                }
                            </SubWrapper>

                            <SubWrapper>
                                <div className="tag">Actions</div>
                                <Actions selectedUser={selectedUser} />
                            </SubWrapper>
                        </>
            }

        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100vw;
    margin: auto;
    max-width: 800px;
    min-height: 70vh;
    display: flex;
    font-size: .8rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px;
    width: 100%;
    margin: 10px auto 40px auto;
    box-shadow: 2px 2px 5px #ccc;

    .amount {
        display: inline-block;
        padding: 2px 0;
        min-width: 120px;
        height: 30px;
        margin-bottom: 20px;
    }
`

const Skeletons = styled.div`
    width: 100%;

    .user {
        height: 100px;
    }

    .type {
        width: 70px;
        height: 20px;
    }
`