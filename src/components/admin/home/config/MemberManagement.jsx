import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import Spinner_ from '../../../spinner/Spinner';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Btn from '../../../Btn/Btn';

const api = new apiClass()


export default function MemberManagement({ initialState }) {
    const { config } = useContext(Context);
    const {
        setConfigData,
        updatingConfig,
        setUpdatingConfig,
        setCategory,
        category
    } = config;

    const [inp, setInp] = useState({
        totalMembers: initialState.totalMembers,
        totalInvestors: initialState.totalInvestors,
        totalWithdrawal: initialState.totalWithdrawal,
        membersCountry: initialState.membersCountry,
        totalDeposit: initialState.totalDeposit,
    });

    const submitForm = () => {
        setUpdatingConfig(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'membermanager')
            }, 2000);
        }
        else {
            api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'membermanager')
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <label>
                    Active Members: {" "}
                    <span className='tag'>
                        {initialState.totalMembers} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.totalMembers || ''}
                    onChange={(e) => setInp({ ...inp, totalMembers: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Total Investors: {" "}
                    <span className='tag'>
                        {initialState.totalInvestors} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.totalInvestors || ''}
                    onChange={(e) => setInp({ ...inp, totalInvestors: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Total Payment: {" "}
                    <span className='tag'>
                        {initialState.totalWithdrawal} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.totalWithdrawal || ''}
                    onChange={(e) => setInp({ ...inp, totalWithdrawal: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Total Deposit: {" "}
                    <span className='tag'>
                        {initialState.totalDeposit} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.totalDeposit || ''}
                    onChange={(e) => setInp({ ...inp, totalDeposit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Member's Country: {" "}
                    <span className='tag'>
                        {initialState.membersCountry} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.membersCountry || ''}
                    onChange={(e) => setInp({ ...inp, membersCountry: e.target.value })}
                />
            </InputWrapper>

            <div className='text-center text-md-start mt- pt-2'>

                <Btn onClick={submitForm} color="var(--blue)" link={false}>
                    {updatingConfig && category === 'membermanager' ? <Spinner_ size="sm" /> : "Update"}
                </Btn>
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    
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
        padding: 8px 12px;
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

const InputIcon = styled.div`
    position: absolute;
    padding: 3px;
    width: 30px;
    z-index: 1;
    bottom: 0;
    left: ${({ left }) => left};
    right: ${({ right }) => right};
    font-size: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .icon {
        font-size: 1rem;
    }
`