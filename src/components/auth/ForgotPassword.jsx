import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import Btn from '../Btn/Btn';
import Spinner_ from '../spinner/Spinner';
import axios from 'axios'
import { toast } from 'react-toastify';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_BASE_URL;


export default function ForgotPassword_C() {
    const [sending, setSending] = useState(false);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState({
        token: '',
        status: false
    });

    // submit form
    const submit = async (e) => {
        e.preventDefault();
        setSending(true)

        try {
            const { data } = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
            toast(data.msg, { type: 'success' });

            if (data.token) {
                setToken({ token: data.token, status: true })
            }

            setSending(false);
            setEmail('')

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
            <h3 style={{ textAlign: 'center', color: 'var(--blue)', fontSize: '1.5rem' }}>FORGOT PASSWORD</h3>
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
                                    type="text"
                                    autoFocus
                                    value={email || ''}
                                    placeholder="Email/Username"
                                    onInput={(e) => setEmail(e.target.value)}
                                />
                            </InputWrapper>

                            <div className='text-center text-md-start mt- pt-2'>
                                <Btn disabled={sending || !email} color="var(--blue)" link={false}>
                                    {sending ? <Spinner_ size="sm" /> : "Submit"}
                                </Btn>

                                <div>
                                    {token.status ? <a style={{ cursor: 'pointer' }} target="_blank" href={`/auth/verify-forgot-password/${token.token}`}>Reset Password</a> : ""}
                                </div>


                                <p className="small fw-bold mt-2 pt-1 mb-2">
                                    Back to <Link to="/auth/signin" className="link-danger">Login</Link>
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
            border: 2px solid var(--blue);;
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
