import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context';
import apiClass from '../../../utils/api';
import Skeletons from './Skeletons';
import MaturedHistoryData from './MaturedHistoryData';
import ActiveHistoryData from './ActiveHistoryData';
import { Link } from 'react-router-dom';
import Btn from '../../Btn/Btn';
const api = new apiClass();

export default function History() {

    const { user, investment, fetchDataErrorMsg } = useContext(Context);
    const {
        investmentData_users,
        setInvestmentData_users,
        fetchingInvestments_users,
        setFetchingInvestments_users,
        setFetchInvestmentsMsg_users,
    } = investment.invest;

    const {
        profileData,
        profileLoading,
        fetchProfileSuccess,
        setProfileData,
        setProfileLoadingAgain,
        profileLoadingAgain
    } = user.profile;

    const [load, setLoading] = useState(true)

    useEffect(() => {
        setFetchingInvestments_users(true);
        setProfileLoadingAgain(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.userGetAllInvestments(setInvestmentData_users, setFetchingInvestments_users, setFetchInvestmentsMsg_users)
            }, 2000);
        }
        else {
            api.userGetAllInvestments(setInvestmentData_users, setFetchingInvestments_users, setFetchInvestmentsMsg_users)
        }


        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchProfileAgain(setProfileData, setProfileLoadingAgain)
            }, 2000);
        }
        else {
            api.fetchProfileAgain(setProfileData, setProfileLoadingAgain)
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, []);


    return (
        <Wrapper>
            {
                load || fetchingInvestments_users || profileLoadingAgain ? <Skeletons /> :
                    !investmentData_users || !profileData ?
                        <div style={{ color: 'red' }} className="tag">{fetchDataErrorMsg}</div> :
                        <>
                            <div className='profile-info'>

                                <h1 style={{ color: '#fff', textAlign: 'center', margin: '10px auto 0 auto' }}>${profileData.amount}</h1>
                                <div style={{ color: '#aaa', fontSize: '0.7rem', textAlign: 'center' }}>
                                    Total Investmenet Earnings: {" "}
                                    {function () {
                                        let sum = 0;
                                        const filtereddata = investmentData_users.data?.maturedInvestment.filter(item => {
                                            const amount = item.amount;
                                            const rewards = item.rewards;

                                            const returns = rewards - amount
                                            sum += returns
                                        })

                                        return `$${sum}`
                                    }()}
                                </div>
                                <div style={{ color: '#aaa', fontSize: '0.7rem', textAlign: 'center' }}>
                                    Number of times Invested: {profileData.investmentCount}
                                </div>

                                <div style={{ textAlign: 'center', margin: '30px auto 10px auto' }}>
                                    <Btn url="/dashboard/withdrawal">WITHDRAW</Btn>
                                </div>

                                <div className="btn-row">
                                    <div>
                                        <Btn color="var(--blue)" url="/dashboard/plans">INVEST</Btn>
                                    </div>
                                    <div>
                                        <Btn color="var(--blue)" url="/dashboard/deposit">DEPOSIT</Btn>
                                    </div>
                                </div>
                            </div>

                            <br />
                            <br />


                            <div className="investment-hx">
                                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                    <div className="tag title">Active Investment</div>
                                    <ActiveHistoryData data={investmentData_users.data?.activeInvestment} />
                                </div>

                                <div style={{ paddingTop: '10px' }}>
                                    <div className="tag title">Matured Investment</div>
                                    <MaturedHistoryData data={investmentData_users.data?.maturedInvestment} />
                                </div>
                            </div>
                        </>
            }
        </Wrapper >
    )
}



const Wrapper = styled.div`  
    .tag {
        font-size: .65rem;
    }
    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
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

    .investment-hx {
        padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
        }
    }

    .profile-info {
        background: var(--blue2);
        position: relative;
        width: 100%;
        font-weight: bold;

        padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
        }

        .btn-row {
            position: absolute;
            height: 50px;
            left: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            right: 0;
            width: 100%;
            bottom: -25px;
        }
    }
`