import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { Context } from '../../../context/Context';
import apiClass from '../../../utils/api';
import axios from 'axios'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
import Btn from '../../../components/Btn/Btn';
import { useNavigate } from 'react-router-dom';
import Spinner_ from '../../../components/spinner/Spinner';

const api = new apiClass()
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default function AdminLogin() {
    const { modal } = useContext(Context);
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    // submit the password to the backend
    const callApi = async () => {
        try {
            const { data } = await axios.post(`${BASE_URL}/config/admin-login`, { password }, {
                headers: {
                    'authorization': `Bearer ${Cookies.get('accesstoken')}`
                }
            });
            // set admin token in cookie session
            api.setAdminCookies(data.admintoken);

            // navigate to admin dashboard
            navigate('/admin')

            setLoading(false)
            setPassword('')

            // remove remodal
            modal.setShow(false)

        } catch (err) {
            if (err.response) {
                toast(err.response.data.msg, { type: 'error', toastId: "toastid" })
            }
            else {
                toast(err.message, { type: 'error', toastId: "toastid" })
            }
            setLoading(false)
        }
    }

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)
        // if accesstoken not there, refresh it before proceeding to subnit, otherwise, get submit straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                callApi()
            }, 5000);
        }
        else {
            callApi()
        }
    }

    return (
        <Wrapper onSubmit={submitForm}>
            <InputWrapper>
                <InputIcon right="" left="0">
                    <VpnKeyRoundedIcon className='icon' />
                </InputIcon>
                <input
                    autoFocus
                    type={showPassword ? "text" : "password"}
                    value={password || ''}
                    placeholder="Admin Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputIcon onClick={() => setShowPassword(!showPassword)} right="0" left="">
                    {showPassword ? <VisibilityOffRoundedIcon className='icon' /> : <RemoveRedEyeRoundedIcon className='icon' />}
                </InputIcon>
            </InputWrapper>

            <div className='text-center text-md-end mt- pt-2'>
                <Btn disabled={loading || !password} color="var(--blue)" link={false}>
                    {loading ? <Spinner_ size="sm" /> : "login"}
                </Btn>
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.form`
    // width: 100%;
    // display: flex;
    // justify-content: center;
`

const InputWrapper = styled.div`
    width: 100%;
    height: 45px;
    margin-bottom: 15px;
    position: relative;
    
    
    input {
        border: 1px solid #ccc;
        padding: 12px 30px 12px 30px;
        height: 100%;
        width: 100%;
        display: block;
        border-radius: 8px;
        font-size: .9rem;

        &: focus{
            outline: none;
            border: 2px solid var(--blue);
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
        font-size: 1.4rem;
    }
`