import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import ProfileInfo from './ProfileInfo';
import EditableProfileInfo from './EditableProfileInfo';
import ResetPassword from './ResetPassword';
import Skeletons from './Skeletons';
import apiClass from '../../../utils/api';
import Cookies from 'js-cookie'

const api = new apiClass()

export default function UpdateAccount() {
    const { user, fetchDataErrorMsg } = useContext(Context);

    const [load, setLoading] = useState(true)

    const {
        profileData,
        profileLoading,
        fetchProfileSuccess,
        setProfileData,
        setProfileLoadingAgain,
        profileLoadingAgain
    } = user.profile;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    const initiastate = {
        address: profileData?.address,
        country: profileData?.country,
        phone: profileData?.phone,
        profileImage: profileData?.profilePicUrl
    }

    useEffect(() => {
        setProfileLoadingAgain(true)

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
    }, [])



    return (
        <Wrapper>
            {
                load || profileLoading || profileLoadingAgain ? <Skeletons /> :
                    !fetchProfileSuccess ?
                        <div style={{ color: 'red', fontSize: '.7rem' }} className="center">{fetchDataErrorMsg}</div> :
                        <>
                            <SubWrapper>
                                <ProfileInfo />
                            </SubWrapper>

                            <SubWrapper>
                                <EditableProfileInfo initiastate={initiastate} />
                            </SubWrapper>
                            <SubWrapper>
                                <div className="tag">Reset Password</div>
                                <ResetPassword />
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
    padding: 20px;
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