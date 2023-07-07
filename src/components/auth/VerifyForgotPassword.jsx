import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { MDBContainer, MDBCol, MDBRow, MDBCheckbox } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Btn from '../Btn/Btn';
import Cookies from "js-cookie";
import Spinner_ from '../spinner/Spinner';
import axios from 'axios'
import { toast } from 'react-toastify';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

export default function VerifyForgotPassword_C() {
    const { token } = useParams()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [sending, setSending] = useState(false);
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')

    // submit form
    const submit = async (e) => {
        e.preventDefault();
        setSending(true)
        const data_ = { password, cpassword }

        try {
            const { data } = await axios.put(`${BASE_URL}/auth/verify-forgot-password/?token=${token}`, { ...data_ });
            toast(data.msg, { type: 'success' });

            setSending(false);

            // clear input
            setPassword("")
            setCpassword("")

            if (data.refreshtoken && data.accesstoken) {
                // log the user in

                Cookies.set("accesstoken", data.accesstoken)
                Cookies.set("refreshtoken", data.refreshtoken)
                Cookies.set("role", data.data.role);

                // redirect the user home after some time (at home, he will be redirected to dashboard if refreshtoken exist in cookies)
                navigate('/')
            }

        }
        catch (err) {
            if (err.response) {
                toast(err.response.data.msg, { type: 'error' })

            }
            else {
                toast(err.message, { type: 'error' })
            }

            setSending(false)
        }
    }

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center', color: 'var(--blue)', fontSize: '1.5rem' }}>RESET YOUR PASSWORD</h3>
            <MDBContainer fluid className="p-3h-custom">
                <MDBRow>

                    <MDBCol className='bg' style={{ maxWidth: '500px' }} col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
                    </MDBCol>

                    <MDBCol col='4' md='6'>

                        <form style={{ margin: "10px 0" }} onSubmit={submit}>

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

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <VpnKeyRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type={showCPassword ? "text" : "password"}
                                    value={cpassword || ''}
                                    placeholder="Confirm Password"
                                    onInput={(e) => setCpassword(e.target.value)}
                                />
                                <InputIcon onClick={() => setShowCPassword(!showCPassword)} right="0" left="">
                                    {showPassword ? <VisibilityOffRoundedIcon className='icon' /> : <RemoveRedEyeRoundedIcon className='icon' />}
                                </InputIcon>
                            </InputWrapper>

                            <div className='text-center text-md-start mt- pt-2'>
                                <Btn disabled={sending || !password || !cpassword} color="var(--blue)" link={false}>
                                    {sending ? <Spinner_ size="sm" /> : "Reset"}
                                </Btn>

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