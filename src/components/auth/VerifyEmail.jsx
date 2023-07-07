import styled from 'styled-components';
import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from '../../context/Context';
import apiClass from '../../utils/api';
import axios from 'axios'

const api = new apiClass()
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL


export default function VerifyEmail_C() {
    const { contact } = useContext(Context)
    const navigate = useNavigate()
    const { token } = useParams()
    const [loading, setLoading] = useState(true)
    const [fetched, setFetched] = useState({
        msg: "",
        status: false,
        success: false
    })
    const time1 = 7000
    const time2 = 7000
    const time3 = 3000

    setTimeout(() => {
        setLoading(false)
    }, time1)


    setTimeout(() => {
        setLoading(false)
    }, time1)

    const sendToken = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/auth/verify-email/?token=${token}`);

            // log the user in
            api.setCookies(data.accesstoken, data.refreshtoken, data.data.role)

            setFetched({
                status: true,
                msg: data.msg,
                success: true
            });
        }
        catch (err) {
            if (err.response) {
                setFetched({
                    status: true,
                    msg: err.response.data.msg,
                    success: false
                })
            }
            else {
                setFetched({
                    status: true,
                    msg: err.message,
                    success: false
                })
            }
        }
    }

    useEffect(() => {
        if (!loading) {

            // send token to backend
            setTimeout(() => {
                sendToken()
            }, time3)

        }
    }, [loading])



    // redirect the user home after some time (at home, he will be redirected to dashboard if refreshtoken exist in cookies)
    useEffect(() => {
        if (fetched.success) {
            setTimeout(() => {
                navigate('/')
            }, time2)
        }
    }, [fetched.success])

    return (
        <VerifyWrapper>
            {(function () {
                // preparing to call verify api
                if (loading) {
                    return <>
                        <h3 style={{ textAlign: 'center' }}>Welcome to {contact.name}!</h3>
                        <div style={{ textAlign: 'center' }}>Wait while we activate your accout</div>
                        <div style={{ textAlign: 'center', fontSize: '.7rem' }}>Loading...</div>
                        <div className="img">
                            <img style={{ width: '100%', height: '100%' }} src="/verify-email1.gif" />
                        </div>
                    </>
                }

                // start calling verify api
                if (!loading && !fetched.status) {
                    return <>
                        <h3 style={{ textAlign: 'center' }}>Welcome to {contact.name}!</h3>
                        <div style={{ textAlign: 'center' }}>Almost there</div>
                        <h4 style={{ textAlign: 'center', fontSize: '.7rem' }}>Loading...</h4>
                        <div className="img">
                            <img style={{ width: '100%', height: '100%' }} src="/verify-email2.gif" />
                        </div>
                    </>
                }

                // verification succeeded or failed
                if (!loading && fetched.status) {
                    return fetched.success ?
                        <>
                            <h3 style={{ textAlign: 'center' }}>Congratulations!</h3>
                            <div style={{ textAlign: 'center' }}>{fetched.msg} You will be redirected to your dashboard in few seconds or <Link to="/dashboard">click here</Link> to continue</div>

                            <div className="img">
                                <img style={{ width: '100%', height: '100%' }} src="/check2.png" />
                            </div>
                        </> :
                        fetched.msg.includes("Your account has already been verified") ?
                            (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        {fetched.msg} Please <Link to="/auth/signin">Login</Link>
                                    </div>
                                </>
                            ) :
                            (
                                <>
                                    <div style={{ textAlign: 'center', color: '#c20' }}>{fetched.msg}</div>

                                    <div className="img"
                                        style={{
                                            width: '40%',
                                            height: '40%',
                                            maxWidth: '300px',
                                            maxHeight: '300px',
                                            minWidth: '200px',
                                            minHeight: '200px',
                                        }}>
                                        <img style={{ width: '100%', height: '100%' }} src="/404_1.png" />
                                    </div>
                                </>
                            )
                }
            }())}

        </VerifyWrapper >
    )
}


const VerifyWrapper = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    flex-direction: column;
    padding: 50px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 50px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 50px ${({ theme }) => theme.sm_padding};
    }

    .img {
        width: 20%;
        height: 20%;
        max-width: 150px;
        max-height: 150px;
        min-width: 100px;
        min-height: 100px;
    }

    a {
        color: blue;
         &:hover {
            opacity: .3;
         }
    }
`