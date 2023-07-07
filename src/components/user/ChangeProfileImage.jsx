import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Context } from '../../context/Context';
import apiClass from '../../utils/api';

const api = new apiClass()

export default function ChangeProfileImage() {
    const { user } = useContext(Context)

    const {
        setProfileData,
        setProfileLoadingAgain,
    } = user.profile;

    const {
        setProfileImageLoading,
    } = user.profileImage

    const handleChangeProfile = (e) => {
        setProfileImageLoading(true)

        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.changeProfileImage(
                    setProfileImageLoading,
                    e.target.files[0],
                    setProfileLoadingAgain,
                    setProfileData,
                )
            }, 2000);
        }
        else {
            api.changeProfileImage(
                setProfileImageLoading,
                e.target.files[0],
                setProfileLoadingAgain,
                setProfileData,
            )
        }
    }


    return <input
        style={{
            width: '1px',
            height: '1px',
            visibility: 'hidden',
            opacity: 0,
            position: 'absolute',
        }}
        onChange={handleChangeProfile}
        hidden
        type="file"
        id="file"
        accept="image/*"
    />
}
