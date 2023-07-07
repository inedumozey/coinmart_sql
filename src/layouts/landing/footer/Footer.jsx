import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from "react-router-dom";
import { Context } from '../../../context/Context';
import Copyright from '../../../components/Copyright';
import Email from '../../../components/Email';
import Phone from '../../../components/Phone';

export default function Footer() {
    const location = useLocation();
    const state = useContext(Context)
    const { contact, info } = state
    const isAboutUsRoute = location.pathname === '/about-us';

    return (
        <FooterStyle>
            <div className="top">
                <div className="col col1">
                    <div className="img">
                        <img src="/logo.png" alt="" />
                    </div>
                    <div className="text">{info.footerWord}</div>
                    <div className="form">
                        <div>
                            <div style={{ textAlign: 'center', fontWeight: 500 }}>Subscribe to our news letter</div>
                            <div className="form-group">
                                <input type="text" placeholder='Enter you Email' />
                                <div className='action'>Subscribe</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col2">
                    <div className='wrapper'>
                        <h4> Service Links</h4>
                        <div><Link to="/contact">{">"}Customer Care</Link></div>
                        <div><Link to="/auth/tc">{">"}Terms & Conditions</Link></div>
                        <div><Link to="/login">{">"}Login</Link></div>
                    </div>
                </div>
                <div className="col col3">
                    <div className="info">
                        <h4>Information</h4>
                        <div>
                            <Email />
                        </div>
                        <div>
                            <Phone />
                        </div>
                    </div>
                    <div className="info">
                        <h4>Address</h4>
                        <div>{contact.address}</div>
                    </div>
                    {
                        location.pathname === '/about-us' ?
                            <div onClick={() => window.open(`/certificate/1668012585323`)} className="info cert">
                                <a>See our Certificate</a>
                                <div style={{ width: "70%" }}>
                                    <img src="/cert.jpg" alt="" />
                                </div>
                            </div> : ''

                    }
                </div>
            </div>
            <Copyright />
        </FooterStyle>
    )
}


const FooterStyle = styled.div`

    img {
        width: 100%;
        height: 100%
    }

    .top {
        height: calc(100% - 98px);
        background: rgba(255, 255, 255, .85) url('/hero3.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        background-blend-mode: lighten;
        padding: 40px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 40px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 40px ${({ theme }) => theme.sm_padding};
            flex-direction: column;
            align-items: center;            
        }

        .col1 {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 40%;
            .img {
                width: 150px;
                height: 90px;
            }

            .text {
                margin: 5px 0 20px 0;
            }

            .form {
                // height: 40px;
                width: 100%;
                dislay: flex;

                @media (max-width: ${({ theme }) => theme.sm_screen}){
                    display: flex;
                    width: 100%;
                    justify-content: center;  
                }
                @media (max-width: ${({ theme }) => theme.md_screen}){ 
                    margin-bottom: 20px;
                }

            }
            .form-group {
                border: 1px solid #ccc;
                height: 40px;
                display: flex;
                width: 100%;

                @media (max-width: ${({ theme }) => theme.sm_screen}){
                    width: 90%; 
                }
                
                .action {
                    width: 75px;
                    height: 100%;
                    line-height: 35px;
                    text-align: center;
                    background: var(--yellow);
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                }
                input {
                    width: calc(100% - 75px);
                    height: 100%;
                    border: none;
                    padding: 10px;

                    &:focus {
                        outline: none;
                        border: none;
                    }
                }
            }
        }
        .col2 {
            margin: 0 25px;
            @media (max-width: ${({ theme }) => theme.sm_screen}){
                margin: 15px 0;                   
            }
        }

        .col3 {
            .info {
                margin-bottom: 20px;
            }
            .cert {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                transition: ${({ theme }) => theme.transition};
                &:hover{
                    color: blue;
                    opacity: .7;
                }
            }
        }
        .col {
            @media (max-width: ${({ theme }) => theme.sm_screen}){
                width: 100%;     
            }
        }
    }
`