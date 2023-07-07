import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import Spinner_ from '../../../spinner/Spinner';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Btn from '../../../Btn/Btn';
import Select from 'react-select'

const api = new apiClass()


export default function Investment({ initialState }) {
    const { config } = useContext(Context);
    const {
        setConfigData,
        updatingConfig,
        setUpdatingConfig,
        setCategory,
        category
    } = config;

    const [inp, setInp] = useState({
        allowInvestment: initialState.allowInvestment,
        investmentLimits: initialState.investmentLimits
    });

    const submitForm = () => {
        setUpdatingConfig(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'investment')
            }, 2000);
        }
        else {
            api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'investment')
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <label>
                    Allow Investment?: {" "}
                    <span className='tag'>
                        {initialState.allowInvestment ? 'true' : 'false'}
                    </span>
                </label>
                <Select
                    options={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' }
                    ]}
                    defaultValue={{ value: inp.allowInvestment ? 'true' : "false", label: inp.allowInvestment ? 'true' : "false" }}
                    onChange={(selectedOption) => setInp({ ...inp, allowInvestment: selectedOption.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Investment Count Limit: {" "}
                    <span className='tag'>
                        {initialState.investmentLimits} {" "}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.investmentLimits || ''}
                    onChange={(e) => setInp({ ...inp, investmentLimits: e.target.value })}
                />
            </InputWrapper>


            <div className='text-center text-md-start mt- pt-2'>

                <Btn onClick={submitForm} color="var(--blue)" link={false}>
                    {updatingConfig && category === 'investment' ? <Spinner_ size="sm" /> : "Update"}
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
