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
import moment from 'moment'

const api = new apiClass()


export default function Referral({ initialState }) {
    const { config } = useContext(Context);
    const {
        setConfigData,
        updatingConfig,
        setUpdatingConfig,
        setCategory,
        category
    } = config;

    const [inp, setInp] = useState({
        referralBonusPercentage: initialState.referralBonusPercentage,
        referralBonusLimit: initialState.referralBonusLimit,
        referralContestPercentage: initialState.referralContestPercentage,
        allowReferralContest: initialState.allowReferralContest,
        startContestReg: initialState.startContestReg,
        referralContestStarts: initialState.referralContestStarts,
        referralContestStops: initialState.referralContestStops,
        referralContestPrizes: initialState.referralContestPrizes,
    });

    const submitForm = () => {
        setUpdatingConfig(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'referral')
            }, 2000);
        }
        else {
            api.updateConfig(setUpdatingConfig, inp, setConfigData, setCategory, 'referral')
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <label>
                    Referral Bonus: {" "}
                    <span className='tag'>
                        {initialState.referralBonusPercentage}%
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.referralBonusPercentage || ''}
                    onChange={(e) => setInp({ ...inp, referralBonusPercentage: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Referral Bonus Limit: {" "}
                    <span className='tag'>
                        {initialState.referralBonusLimit}
                    </span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={inp.referralBonusLimit || ''}
                    onChange={(e) => setInp({ ...inp, referralBonusLimit: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Start Contest Reg?: {" "}
                    <span className='tag'>
                        {initialState.startContestReg ? 'true' : 'false'}
                    </span>
                </label>
                <Select
                    options={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' }
                    ]}
                    defaultValue={{ value: inp.startContestReg ? 'true' : "false", label: inp.startContestReg ? 'true' : "false" }}
                    onChange={(selectedOption) => setInp({ ...inp, startContestReg: selectedOption.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Start Contest?: {" "}
                    <span className='tag'>
                        {initialState.allowReferralContest ? 'true' : 'false'}
                    </span>
                </label>
                <Select
                    options={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' }
                    ]}
                    defaultValue={{ value: inp.allowReferralContest ? 'true' : "false", label: inp.allowReferralContest ? 'true' : "false" }}
                    onChange={(selectedOption) => setInp({ ...inp, allowReferralContest: selectedOption.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Contest Prizes: {" "}
                    <span className='tag'>
                        {initialState.currency}
                    </span>
                </label>
                <CreatableSelect
                    isMulti
                    isClearable
                    options={[]}
                    defaultValue={resolve.makeReactSelectOptions(inp.referralContestPrizes)}
                    onChange={(value => {
                        const option = value.map(value => value.value);
                        setInp({ ...inp, referralContestPrizes: option })
                    })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Contest Starts At: {" "}
                    <span className='tag'>
                        {new Date(initialState.referralContestStarts).toLocaleString()}
                    </span>
                </label>
                <input
                    type="datetime-local"
                    value={moment(inp.referralContestStarts).format("YYYY-MM-DDTHH:mm:ss")}
                    onChange={(e) => setInp({ ...inp, referralContestStarts: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper>
                <label>
                    Contest Ends At: {" "}
                    <span className='tag'>
                        {new Date(initialState.referralContestStops).toLocaleString()}
                    </span>
                </label>
                <input
                    type="datetime-local"
                    value={moment(inp.referralContestStops).format("YYYY-MM-DDTHH:mm:ss")}
                    onChange={(e) => setInp({ ...inp, referralContestStops: e.target.value })}
                />
            </InputWrapper>

            <div className='text-center text-md-start mt- pt-2'>

                <Btn onClick={submitForm} color="var(--blue)" link={false}>
                    {updatingConfig && category === 'referral' ? <Spinner_ size="sm" /> : "Update"}
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