import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import Btn from '../Btn/Btn';
import Spinner_ from '../spinner/Spinner';
import axios from 'axios'
import { toast } from 'react-toastify';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

export default function Signup_C() {
    const location = useLocation()
    const { search } = location
    const refcode = search.split("=")[1]

    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [sending, setSending] = useState(false);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [acceptTerm, setAcceptTerm] = useState(false);
    const [allInputFilled, setAllInputFilled] = useState(false);
    const [token, setToken] = useState({
        token: '',
        status: false
    });

    useEffect(() => {
        if (email && username && password && cpassword && phone && country && address && acceptTerm) {
            setAllInputFilled(true)
        }
        else {
            setAllInputFilled(false)
        }
    }, [email, username, password, cpassword, phone, country, address, acceptTerm])

    // submit form
    const submit = async (e) => {
        e.preventDefault();

        setSending(true)

        const data_ = { email, username, password, cpassword, phone, country, address }
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signup/?refcode=${refcode}`, { ...data_ });
            toast(data.msg, { type: 'success' })

            // if the backend is dev mode, token will be sent here instead of to the email
            if (data.token) {
                setToken({ token: data.token, status: true })
            }

            setSending(false);
            setEmail("");
            setUsername("");
            setPassword("");
            setCpassword("");
            setPhone("");
            setCountry("");
            setAddress("");
        }
        catch (err) {
            if (err.response) {
                toast(err.response.data.msg, { type: 'error' })
            }
            else {
                toast(err.message, { type: 'error' })
            }

            setToken({ token: "", status: false })

            setSending(false);
        }
    }

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center', color: 'var(--blue)', fontSize: '1.5rem' }}>SIGN UP</h3>
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
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </InputWrapper>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <PersonRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type="text"
                                    value={username || ''}
                                    placeholder="Username"
                                    onInput={(e) => setUsername(e.target.value)}
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
                                    {showCPassword ? <VisibilityOffRoundedIcon className='icon' /> : <RemoveRedEyeRoundedIcon className='icon' />}
                                </InputIcon>
                            </InputWrapper>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <LocalPhoneRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type="text"
                                    value={phone || ''}
                                    placeholder="Phone Number"
                                    onInput={(e) => setPhone(e.target.value)}
                                />
                            </InputWrapper>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <FlagRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type="text"
                                    value={country || ''}
                                    placeholder="Country"
                                    onInput={(e) => setCountry(e.target.value)}
                                />
                            </InputWrapper>

                            <InputWrapper>
                                <InputIcon right="" left="0">
                                    <AlternateEmailRoundedIcon className='icon' />
                                </InputIcon>
                                <input
                                    type="text"
                                    value={address || ''}
                                    placeholder="Address"
                                    onInput={(e) => setAddress(e.target.value)}
                                />
                            </InputWrapper>

                            <div className="d-flex mb-2">
                                <input
                                    type='checkbox'
                                    id="checkbox"
                                    onChange={(e) => setAcceptTerm(e.target.checked)}
                                />
                                <label style={{ fontSize: '.7rem', paddingLeft: '3px' }} htmlFor="checkbox">Accept Terms</label>
                            </div>

                            <div className='text-center text-md-start mt- pt-2'>
                                <p className="small mt-2 pt-1 mb-2">
                                    By creating an account you are accepting our <Link to="/auth/tc" className="link-danger">Terms & Conditions</Link>
                                </p>

                                <Btn disabled={sending || !allInputFilled} color="var(--blue)" link={false}>
                                    {sending ? <Spinner_ size="sm" /> : "Sign Up"}
                                </Btn>

                                <div>
                                    {token.status ? <a style={{ cursor: 'pointer' }} target="_blank" href={`/auth/verify-email/${token.token}`}>Verify Your Account</a> : ""}
                                </div>
                                <p className="small fw-bold mt-2 pt-1 mb-2">
                                    Have an account? <Link to="/auth/signin" className="link-danger">Sign in</Link>
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