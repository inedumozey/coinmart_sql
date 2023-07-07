import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Skeleton from '../../Skeleton';
import Transfer from './config/Transfer';
import Withdrawal from './config/Withdrawal';
import Investment from './config/Investment';
import MemberManagement from './config/MemberManagement';
import Referral from './config/Referral';
import AdminResetPassword from './config/AdminResetPassword';


export default function Home() {
    const { config } = useContext(Context);
    const [load, setLoading] = useState(true)
   

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <Wrapper>

            {
                load || !config.configData ?
                    <Skeletons>
                        {
                            [1, 2, 3, 4].map((item, i) => {
                                return <SubWrapper key={i} className='user'>
                                    <div className="type"><Skeleton /></div>
                                </SubWrapper>
                            })
                        }
                    </Skeletons> :

                    <>
                        <SubWrapper>
                            <div className="tag">Transfer Config</div>
                            <Transfer initialState={config.configData} />
                        </SubWrapper>

                        <SubWrapper>
                            <div className="tag">Withdrawal Config</div>
                            <Withdrawal initialState={config.configData} />
                        </SubWrapper>

                        <SubWrapper>
                            <div className="tag">Investment Config</div>
                            <Investment initialState={config.configData} />
                        </SubWrapper>

                        <SubWrapper>
                            <div className="tag">Member's Management</div>
                            <MemberManagement initialState={config.configData} />
                        </SubWrapper>

                        <SubWrapper>
                            <div className="tag">Referral Control</div>
                            <Referral initialState={config.configData} />
                        </SubWrapper>

                        <SubWrapper>
                            <div className="tag">Reset Admin Password</div>
                            <AdminResetPassword />
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
    }
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px 10px;
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