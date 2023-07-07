import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { MDBContainer, MDBCol, MDBRow, MDBCheckbox } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import Btn from '../Btn/Btn';
import Spinner_ from '../spinner/Spinner';
import axios from 'axios'
import { toast } from 'react-toastify';
import apiClass from '../../utils/api';
import Cookies from 'js-cookie';

const api = new apiClass()

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default function Signin_C() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendLink, setSendingLink] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allInputFilled, setAllInputFilled] = useState(false);
    const [verifyMsg, setVerifyMsg] = useState('');
    const [token, setToken] = useState({
        token: '',
        status: false
    });

    useEffect(() => {
        if (email && password) {
            setAllInputFilled(true)
        }
        else {
            setAllInputFilled(false)
        }
    }, [email, password])


    // submit form
    const submit = async (e) => {
        e.preventDefault();

        setSending(true)
        const data_ = { email, password }

        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signin`, { ...data_ });

            setSending(false);
            setVerifyMsg('')

            // log the user in
            api.setCookies(data.accesstoken, data.refreshtoken, data.data.role)

            // redirect the user home after some time (at home, he will be redirected to dashboard if refreshtoken exist in cookies)
            navigate('/')

            // clear input
            setEmail("");
            setPassword("");
        }
        catch (err) {
            if (err.response) {
                toast(err.response.data.msg, { type: 'error' })

                // if user not yet verified, seve their info in cookies so that it can be used to resend verification link incase they have lost the link from their email
                if (err.response.data.msg.includes("Please verify your account to login in")) {
                    setVerifyMsg(true)

                    Cookies.set("access", email);

                    // clear input
                    setEmail("");
                    setPassword("");
                }
            }
            else {
                toast(err.message, { type: 'error' })
            }

            setSending(false)
        }
    }

    // resend email verification link
    const resendLink = async () => {

        setSendingLink(true)

        try {
            const { data } = await axios.post(`${BASE_URL}/auth/resend-verification-link`, { email: Cookies.get("access") });
            toast(data.msg, { type: 'success' })
            setSendingLink(false);
            Cookies.remove("access")

            if (data.token) {
                setToken({ token: data.token, status: true })
            }

        }
        catch (err) {
            if (err.response) {
                toast(err.response.data.msg, { type: 'error' })
            }
            else {
                toast(err.message, { type: 'error' })
            }

            setSendingLink(false)
            setToken({ token: "", status: false })
        }
    }

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center', color: 'var(--blue)', fontSize: '1.5rem' }}>SIGN IN</h3>
            <MDBContainer fluid className="p-3h-custom">
                <MDBRow>

                    <MDBCol className='bg' col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
                    </MDBCol>

                    <MDBCol col='4' md='6'>

                        <form style={{ margin: "10px 0" }} onSubmit={submit}>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <EmailRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    autoFocus
                                    type="text"
                                    value={email || ''}
                                    placeholder="Email/Username"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </InputWrapper>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <VpnKeyRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password || ''}
                                    placeholder="Password"
                                    onInput={(e) => setPassword(e.target.value)}
                                />
                                <InputIcon onClick={() => setShowPassword(!showPassword)} right="0" left="">
                                    {showPassword ? <VisibilityOffRoundedIcon className='icon' /> : <RemoveRedEyeRoundedIcon className='icon' />}
                                </InputIcon>
                            </InputWrapper>

                            <div className="d-flex justify-content-between mb-2">
                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                                <Link to="/auth/forgot-password">Forgot password?</Link>
                            </div>


                            {
                                verifyMsg ?
                                    <div className="d-flex justify-content-between mb-2">
                                        {sendLink ? <Spinner_ size="sm" /> : <a onClick={resendLink} style={{ cursor: 'pointer' }}>Resend Link</a>}
                                    </div>
                                    : ''
                            }

                            <div className='text-center text-md-start mt- pt-2'>

                                <Btn disabled={sending || !allInputFilled} color="var(--blue)" link={false}>
                                    {sending ? <Spinner_ size="sm" /> : "Sign In"}
                                </Btn>

                                <div>
                                    {token.status ? <a style={{ cursor: 'pointer' }} target="_blank" href={`/auth/verify-email/${token.token}`}>Verify Your Account</a> : ""}
                                </div>

                                <p className="small fw-bold mt-2 pt-1 mb-2">
                                    Don't have an account? <Link to="/auth/signup" className="link-danger">Sign Up</Link>
                                </p>
                            </div>

                        </form>

                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding: 0 ${({ theme }) => theme.lg_padding} 20px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 0 ${({ theme }) => theme.md_padding} 20px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 0 ${({ theme }) => theme.sm_padding} 20px ${({ theme }) => theme.sm_padding};
    }
    @media (max-width: 767px){
        .bg {
            display: none;
        }
    }
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

    input[type="submit"]{
        border-radius: 20px;
        color: #fff;
        border: none;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        background: var(--blue);
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