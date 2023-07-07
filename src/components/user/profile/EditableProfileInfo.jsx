import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Spinner_ from '../../spinner/Spinner';
import apiClass from '../../../utils/api';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import PublicIcon from '@mui/icons-material/Public';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Cookies from 'js-cookie'
import Btn from '../../Btn/Btn';

const api = new apiClass()

export default function EditableProfileInfo({ initiastate }) {
    const { user } = useContext(Context);

    const {
        setProfileData,
        profileLoadingAgain,
        setProfileLoadingAgain,
        setFetchProfileSuccess,
        setFetchProfileMsg,
        editProfileLoading,
        setEditProfileLoading } = user.profile;

    const [inp, setInp] = useState(initiastate);

    const submitForm = () => {
        setEditProfileLoading(true)
        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.updateProfile(setProfileData, setProfileLoadingAgain, setFetchProfileSuccess, setFetchProfileMsg, inp, setEditProfileLoading)
            }, 2000);
        }
        else {
            api.updateProfile(setProfileData, setProfileLoadingAgain, setFetchProfileSuccess, setFetchProfileMsg, inp, setEditProfileLoading)
        }
    }

    return (
        <Wrapper>
            <InputWrapper>
                <InputIcon right="" left="0">
                    <LocalPhoneIcon className='icon' />
                </InputIcon>
                <input
                    type="text"
                    value={inp.phone || ''}
                    onChange={(e) => setInp({ ...inp, phone: e.target.value })}
                    placeholder='Phone Number'
                />
            </InputWrapper>

            <InputWrapper>
                <InputIcon right="" left="0">
                    <EditLocationIcon className='icon' />
                </InputIcon>
                <input
                    type="text"
                    value={inp.address || ''}
                    onChange={(e) => setInp({ ...inp, address: e.target.value })}
                    placeholder='Address'
                />
            </InputWrapper>

            <InputWrapper>
                <InputIcon right="" left="0">
                    <PublicIcon className='icon' />
                </InputIcon>
                <input
                    type="text"
                    value={inp.country || ''}
                    onChange={(e) => setInp({ ...inp, country: e.target.value })}
                    placeholder='Country'
                />
            </InputWrapper>

            <div className='text-center text-md-start mt- pt-2'>

                <Btn disabled={editProfileLoading || profileLoadingAgain} onClick={submitForm} color="var(--blue)" link={false}>
                    {editProfileLoading || profileLoadingAgain ? <Spinner_ size="sm" /> : "Update"}
                </Btn>
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.div`

`
const InputWrapper = styled.div`
    width: 100%;
    height: 45px;
    margin-bottom: 15px;    
    font-size: .8rem;
    position: relative;

    .tag {
        color: #c30;
        font-size: .7rem;
    }
    
    input {
        padding: 8px 30px;
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