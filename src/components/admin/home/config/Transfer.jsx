import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import Spinner_ from '../../../spinner/Spinner';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Btn from '../../../Btn/Btn';
import Select from 'react-select'
import resolve from '../../../../utils/resolve';

const api = new apiClass()


export default function Transfer({ initialState }) {
    const { config } = useContext(Context);
    const {
        configData,
        setConfigData,
        updatingConfig,
        setUpdatingConfig,
        setCategory,
        category
    } = config;

    const [inp, setInp] = useState({
        allowTransfer: initialState.allowTransfer,
        minTransferableLimit: initialState.minTransferableLimit,
        maxTransferableLimit: initialState.maxTransferableLimit,
        transferableCommonDiff: initialState.transferableCommonDiff,
    });

    const submitForm = () => {
        setUpdatingConfig(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'transfer')
            }, 2000);
        }
        else {
            api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'transfer')
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <label>
                    Allow Transfer?: {" "}
                    <span className='tag'>
                        {initialState.allowTransfer ? 'true' : 'false'}
                    </span>
                </label>
                <Select
                    options={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' }
                    ]}
                    defaultValue={{ value: inp.allowTransfer ? 'true' : "false", label: inp.allowTransfer ? 'true' : "false" }}
                    onChange={(selectedOption) => setInp({ ...inp, allowTransfer: selectedOption.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Min Transferable Limit: {" "}
                    <span className='tag'>
                        {initialState.minTransferableLimit} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.minTransferableLimit || ''}
                    onChange={(e) => setInp({ ...inp, minTransferableLimit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Max Transferable Limit: {" "}
                    <span className='tag'>
                        {initialState.maxTransferableLimit} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.maxTransferableLimit || ''}
                    onChange={(e) => setInp({ ...inp, maxTransferableLimit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Common Diff: {" "}
                    <span className='tag'>
                        {initialState.transferableCommonDiff} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.transferableCommonDiff || ''}
                    onChange={(e) => setInp({ ...inp, transferableCommonDiff: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Transfer Factors: {'==>'} To allow any amount, make the factor 1 by making min, max and common diff 1
                </label>
                <Select
                    options={resolve.makeReactSelectOptions(initialState.transferableFactors)}
                    value={initialState.transferableFactors ? resolve.makeReactSelectOptions(initialState.transferableFactors)[0] : ''}
                />
            </InputWrapper>

            <div className='text-center text-md-start mt- pt-2'>

                <Btn onClick={submitForm} color="var(--blue)" link={false}>
                    {updatingConfig && category === "transfer" ? <Spinner_ size="sm" /> : "Update"}
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