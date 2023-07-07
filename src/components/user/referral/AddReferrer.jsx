import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context'
import apiClass from '../../../utils/api'
import Spinner_ from '../../spinner/Spinner'
import Btn from '../../Btn/Btn'

const api = new apiClass()

export default function AddRefcode() {
    const { config, user } = useContext(Context);
    const [refcode, setRefcode] = useState("")

    const {
        addingRefcode,
        setAddingRefcode,
    } = user.referral

    const {
        setProfileData,
        setProfileLoadingAgain,
        profileLoadingAgain,
    } = user.profile

    const submitForm = (e) => {
        e.preventDefault();
        setAddingRefcode(true);

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.addRefecode(refcode, setAddingRefcode, setProfileData, setProfileLoadingAgain)
            }, 2000);
        }
        else {
            api.addRefecode(refcode, setAddingRefcode, setProfileData, setProfileLoadingAgain)
        }
    }

    return (
        <Wrapper onSubmit={submitForm}>
            <InputWrapper>
                <label>Refcode:</label>
                <input
                    autoFocus
                    placeholder='Enter Refcode'
                    value={refcode || ''}
                    onChange={(e) => setRefcode(e.target.value)}
                />
            </InputWrapper>


            <div className='text-center text-md-start mt- pt-2'>

                <Btn disabled={refcode == ""} color="var(--blue)" link={false}>
                    {addingRefcode || profileLoadingAgain ? <Spinner_ size="sm" /> : "Add Refcode"}
                </Btn>
            </div>

        </Wrapper>
    )
}


const Wrapper = styled.form`
    
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