import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import Spinner_ from '../../../spinner/Spinner';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Btn from '../../../Btn/Btn';
import Select from 'react-select'
import resolve from '../../../../utils/resolve';
import CreatableSelect from 'react-select/creatable';

const api = new apiClass()


export default function Withdrawal({ initialState }) {
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
        allowWithdrawal: initialState.allowWithdrawal,
        minWithdrawableLimit: initialState.minWithdrawableLimit,
        maxWithdrawableLimit: initialState.maxWithdrawableLimit,
        withdrawableCommonDiff: initialState.withdrawableCommonDiff,
        pendingWithdrawalDuration: initialState.pendingWithdrawalDuration,
        withdrawableCoins: initialState.withdrawableCoins
    });

    const submitForm = () => {
        setUpdatingConfig(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'withdrawal')
            }, 2000);
        }
        else {
            api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'withdrawal')
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <label>
                    Allow Withdrawal?: {" "}
                    <span className='tag'>
                        {initialState.allowWithdrawal ? 'true' : 'false'}
                    </span>
                </label>
                <Select
                    options={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' }
                    ]}
                    defaultValue={{ value: inp.allowWithdrawal ? 'true' : "false", label: inp.allowWithdrawal ? 'true' : "false" }}
                    onChange={(selectedOption) => setInp({ ...inp, allowWithdrawal: selectedOption.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Pending Withdrawal Duration: {" "}
                    <span className='tag'>
                        {initialState.pendingWithdrawalDuration}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.pendingWithdrawalDuration || ''}
                    onChange={(e) => setInp({ ...inp, pendingWithdrawalDuration: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Min Withdrawalable Limit: {" "}
                    <span className='tag'>
                        {initialState.minWithdrawableLimit} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.minWithdrawableLimit || ''}
                    onChange={(e) => setInp({ ...inp, minWithdrawableLimit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Max Withdrawalable Limit: {" "}
                    <span className='tag'>
                        {initialState.maxWithdrawableLimit} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.maxWithdrawableLimit || ''}
                    onChange={(e) => setInp({ ...inp, maxWithdrawableLimit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Common Diff: {" "}
                    <span className='tag'>
                        {initialState.withdrawableCommonDiff} {" "}
                        {initialState.currency}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.withdrawableCommonDiff || ''}
                    onChange={(e) => setInp({ ...inp, withdrawableCommonDiff: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Withdrawable Coins:
                </label>
                <CreatableSelect
                    isMulti
                    isClearable
                    options={[]}
                    defaultValue={resolve.makeReactSelectOptions(inp.withdrawableCoins)}
                    onChange={(value => {
                        const option = value.map(value => value.value);
                        setInp({ ...inp, withdrawableCoins: option })
                    })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Withdrawal Factors: {'==>'} To allow any amount, make the factor 1 by making min, max and common diff 1
                </label>
                <Select
                    options={resolve.makeReactSelectOptions(initialState.withdrawableFactors)}
                    value={initialState.withdrawableFactors ? resolve.makeReactSelectOptions(initialState.withdrawableFactors)[0] : ''}
                />
            </InputWrapper>



            <div className='text-center text-md-start mt- pt-2'>

                <Btn onClick={submitForm} color="var(--blue)" link={false}>
                    {updatingConfig && category === 'withdrawal' ? <Spinner_ size="sm" /> : "Update"}
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