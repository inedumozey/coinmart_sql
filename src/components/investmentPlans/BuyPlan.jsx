import React, { useState, useContext } from 'react'
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { Context } from '../../context/Context';
import apiClass from '../../utils/api';
import Btn from '../Btn/Btn';
import Spinner_ from '../spinner/Spinner';
import resolve from '../../utils/resolve';
import { useNavigate } from 'react-router-dom';

const api = new apiClass()

export default function BuyPlan() {
    const navigate = useNavigate()
    const { investment, user } = useContext(Context)
    const [amount, setAmount] = useState('')

    const {
        setProfileLoadingAgain,
        profileLoadingAgain,
        setProfileData
    } = user.profile

    const {
        selectedInvestingPlan,
        investLoading,
        setInvestLoading,
        setOpenInvestModal,
    } = investment.invest

    const submitForm = (e, id) => {
        e.preventDefault()
        const data = { amount, id }

        if (!Cookies.get('refreshtoken')) {
            navigate('/auth/signin')
        }

        else {
            setInvestLoading(true)

            // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
            if (!Cookies.get('accesstoken')) {
                api.refreshToken()
                setTimeout(() => {
                    api.buyPlan(data, setInvestLoading, setProfileData, setProfileLoadingAgain, setAmount, setOpenInvestModal)
                }, 2000);
            }
            else {
                api.buyPlan(data, setInvestLoading, setProfileData, setProfileLoadingAgain, setAmount, setOpenInvestModal)
            }
        }
    }

    return (
        <Wrapper>
            <Card>
                <div className="header">
                    <div className="title">{selectedInvestingPlan.type?.toUpperCase()}</div>
                    <div className="profit">
                        <span className="value">{selectedInvestingPlan.returnPercentage}%</span> {""}
                        <span>Profit</span>
                    </div>
                </div>
                <div className="body">
                    <div className="lifespan">{resolve.resolveSeconds(selectedInvestingPlan.lifespan)}</div>
                    <div className="amount">Minimun Amount: {selectedInvestingPlan.minAmount} {" "} {selectedInvestingPlan.currency}</div>
                    <div className="amount">Maximun Amount: {selectedInvestingPlan.maxAmount === 0 ? 'Unlimited' : `${selectedInvestingPlan.maxAmount} ${selectedInvestingPlan.currency}`}</div>
                    <div className="amount">Point: {selectedInvestingPlan.point}</div>
                </div>

                {/* form */}

                <form onSubmit={(e) => submitForm(e, selectedInvestingPlan._id)} style={{ marginTop: '20px' }}>
                    <InputWrapper>
                        <input
                            autoFocus
                            type="number"
                            value={amount || ''}
                            placeholder="Enter amount"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </InputWrapper>

                    <div className='center'>
                        <Btn disabled={!amount} color="var(--blue)" link={false}>
                            {investLoading || profileLoadingAgain ? <Spinner_ size="sm" /> : "Start"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </Wrapper>
    )
}



const Wrapper = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat( auto-fit, minmax(200px, 1fr) );
    padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
            grid-template-columns: repeat( auto-fit, minmax(170px, 1fr) );
        }
    }
`

const Card = styled.div`
    width: 100%;
    min-height: 350px;
    box-shadow: 2px 2px 4px #ccc, -2px -2px 4px #ccc;
    background: #fff;
    padding: 20px 10px;
    margin: 10px auto;

    .header {
        min-height: 100px;
        .title {
            background: var(--blue);
            font-weight: bold;
            text-align: center;
            padding: 20px 10px;
            color: #fff;
            width: 100%;
        }
    
        .profit {
            padding: 10px 0;
            text-align: center;
            
            .value {
                color: var(--yellow);
                font-weight: bold;
                font-size: 1.6rem;
            }
        }
    }
    .body {
        .lifespan {
            padding: 5px 10px;
            font-weight: bold;
            font-size: 1.5rem;
        }

        .amount {
            padding: 3px 10px;
            font-size: 1rem;
            font-weight: 600;
        }
    }
`

const InputWrapper = styled.div`
    width: 100%;
    min-height: 45px;
    margin-bottom: 15px;    
    font-size: .8rem;

    .tag {
        color: #c30;
        font-size: .7rem;
    }
    
    input {
        padding: 10px 12px;
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
        display: block;
        font-size: .9rem;
        border-radius: 5px;

        &: focus{
            outline: none;
            border: 3px solid var(--blue);
        }
    } 
`