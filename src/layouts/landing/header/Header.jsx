import React, { useState, useEffect, useContext } from 'react'
import Btn from '../../../components/Btn/Btn';
import { Link, useLocation } from "react-router-dom";
import styled from 'styled-components'
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Links from '../Links';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Trade from '../../../components/tradeView/Ticker';
import { Context } from '../../../context/Context';

import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import {
    Navigation,
    Pagination,
    A11y,
    Autoplay
} from "swiper/core";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { EffectFade } from 'swiper';


export default function Header({ openMenu, setOpenMenu }) {
    const state = useContext(Context)
    const { contact, info } = state
    const location = useLocation();
    const [stick, setStick] = useState(true)
    const isHomeRoute = location.pathname === '/'
    const [start, setStart] = useState("true");

    const link = [
        { url: '/', name: 'Home' },
        { url: '/about-us', name: 'About Us' },
        { url: '/plans', name: 'Plans' },
        { url: '/faq', name: 'FAQ' },
        { url: '/contact', name: 'Contacts' },
        { url: '/real-estate', name: 'Real Esatate' },
    ]

    const swiperImages = ["/office.jpg", "/office2.jpg", "/hero3.jpg"]

    useEffect(() => {
        window.onscroll = (e) => {
            window.pageYOffset >= 120 ? setStick(true) : setStick(false)
        }
        window.pageYOffset >= 120 ? setStick(true) : setStick(false)
    }, [])

    return (
        <HeaderStyle stick={stick} isHomeRoute={isHomeRoute} start={start} openMenu={openMenu}>
            <div className="nav">
                <Link to="/" className='left'>
                    <img style={{ width: '100%' }} src="/logo.png" />
                </Link>
                <div className="right">
                    <div className='link' style={{ margin: '0 10px' }}><Links link={link} /></div>
                    <div className="login"><Btn url="/auth">LOGIN</Btn></div>
                    <div onClick={() => setOpenMenu(!openMenu)} className="toggle">
                        {openMenu ? <CloseIcon /> : <MenuIcon />}
                    </div>
                </div>

            </div>
            <div className="dropdown">
                <div className="dropdwon-link">
                    {
                        link?.map((link, i) => {
                            return <Link
                                onClick={() => setOpenMenu(false)}
                                key={i}
                                to={link.url}
                                className={location.pathname === link.url ? 'link url-link url-active' : 'link url-link'}>{link.name?.toUpperCase()}
                            </Link>
                        })
                    }
                    <div
                        style={{ marginTop: '35px' }}
                        className="login">
                        <Btn url="/auth">LOGIN</Btn>
                    </div>
                </div>
            </div>

            {
                isHomeRoute ?

                    <div>
                        <Container onClick={() => setOpenMenu(false)} className='bs-container home-page' fluid>
                            <Swiper
                                modules={[Navigation, EffectFade, Autoplay, Pagination, A11y]}
                                loop
                                scrollbar={{ draggable: true }}
                                autoplay={{ delay: 4000 }}
                                pagination={{ clickable: true }}
                                style={{ width: '100%', height: '100%' }}
                                className="swiper"
                                onSlideChange={() => setStart("false")}
                                onSlideChangeTransitionEnd={() => setStart("true")}
                            >
                                {
                                    swiperImages?.map((img, i) => {
                                        return <SwiperSlide key={i} className='slide'>
                                            <Image className='swiper-img' style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={img} fluid />
                                        </SwiperSlide>
                                    })
                                }
                            </Swiper>
                            <div className="overlay overlay1">
                                <a href={`mailto:${contact?.email}`} style={{ marginRight: '10px', cursor: 'pointer' }}>{contact?.email}</a>
                                <a href={`tel:+${contact?.mobile}`} style={{ marginRight: '10px', cursor: 'pointer' }}>{contact?.mobile}</a>
                            </div>
                            <div className="overlay overlay2">
                                <Link to="/" className='left'>
                                    <img style={{ width: '100%' }} src="/logo.png" />
                                </Link>
                                <div className="right">
                                    <div className='link' style={{ margin: '0 10px' }}><Links link={link} /></div>
                                    <div className="login"><Btn url="/auth">LOGIN</Btn></div>
                                </div>
                            </div>
                            <div className="overlay overlay3">
                                <div>{info.secure} <br /> {info.invest}</div>
                                <Btn url="/auth/signup" padding={"15px 25px"}>GET STARTED</Btn>
                            </div>
                        </Container>
                        <div>
                            <Trade />
                        </div>
                    </div> :
                    <Container style={{ position: 'relative' }} className='bs-container none-home-page' fluid>
                        <Image style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="/hero2.jpg" />
                        <div className="overlay overlay1">
                            <a href={`mailto:${contact?.email}`} style={{ marginRight: '10px', cursor: 'pointer' }}>{contact?.email}</a>
                            <a href={`tel:+${contact?.mobile}`} style={{ marginRight: '10px', cursor: 'pointer' }}>{contact?.mobile}</a>
                        </div>
                        <div className="overlay overlay2">
                            <Link to="/" className='left'>
                                <img style={{ width: '100%' }} src="/logo.png" />
                            </Link>
                            <div className="right">
                                <div className='link' style={{ margin: '0 10px' }}><Links link={link} /></div>
                                <div className="login"><Btn url="/auth">LOGIN</Btn></div>
                            </div>
                        </div>
                        <div className="overlay overlay4">
                            {
                                (function () {
                                    const linkName = link?.findIndex(link => {
                                        return link.url === location.pathname
                                    })

                                    return link[linkName]?.name?.toUpperCase()
                                }())
                            }
                        </div>
                    </Container>
            }
        </HeaderStyle >
    )
}


const HeaderStyle = styled.div`
    font-size: .8rem;
    transition: ${({ theme }) => theme.transition};
    position: relative;
    width: 100%;
    height: 100%;

    .nav{
        display: flex;
        height: 68px;
        background: #fff;
        z-index: 1000;
        top: 0;
        transition: ${({ theme }) => theme.transition};
        width: 100%;
        justify-content: space-between;
        padding: 0 ${({ theme }) => theme.lg_padding};
        position: fixed;
        transform:  ${({ stick }) => stick ? 'translateY(0)' : 'translateY(-100px)'};
        box-shadow: ${({ openMenu }) => openMenu ? '' : '2px 2px 3px #999'};

        .left{
            width: 30%;
            max-width: 100px;
            min-width: 70px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .right{
            height: 100%;
            display: flex;
            width: 70%;
            justify-content: flex-end;
            align-items: center;
            font-weight: 600;

            .toggle {
                display: flex;
                width: 40px;
                height: 40px;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                @media (min-width: ${({ theme }) => theme.md_screen}){
                    display: none;
                }
            }
        }

        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 0 ${({ theme }) => theme.md_padding};
            transform: translateY(0);

            .link {
                display: none;
            }
            .login {
                display: none;
            }
        }

        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 0 ${({ theme }) => theme.sm_padding};

            .right {
                width: 20%;
            }
        }
    }

    .dropdown {
        position: fixed;
        width: 100%;
        left: 0;
        height: 320px;
        margin-top: 68px;
        background: #fff;
        top: 0;
        border-top: 1px solid #ddd;
        transition: ${({ theme }) => theme.transition};
        transform : ${({ openMenu }) => openMenu ? 'translateY(0)' : 'translateY(-100%)'};
        display: none;
        z-index: 100;
        padding:-bottom 10px;
        box-shadow: 2px 2px 3px #999;

        @media (max-width: ${({ theme }) => theme.md_screen}){
            display: block;
        }

        .dropdwon-link {
            width: 98%;
            max-width: 600px;
            padding: 0 ${({ theme }) => theme.sm_padding};
            margin: auto;
            font-weight: 600;

            .url-link {
                display: block;
                padding: 10px;
                color: var(--text);
            }

            .url-active {
                color: var(--yellow);
            }
        }
    }
    
    .bs-container {
        position: relative;
        width: 100%;
        height: calc(100vh - 42px);
        overflow: hidden;

        .overlay{
            position: absolute;
            width: 100%;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            z-index: 10;
            padding: 0 ${({ theme }) => theme.lg_padding};
            @media (max-width: ${({ theme }) => theme.md_screen}){
                padding: 0 ${({ theme }) => theme.md_padding};
            }
            @media (max-width: ${({ theme }) => theme.sm_screen}){
                padding: 0 ${({ theme }) => theme.sm_padding};
            }
        }

        .overlay1 {
            top: 0;
            font-size: .8rem;
            font-weight: 600;
            padding-top: 10px;
            color: #ccc;
            padding-bottom: 10px;
            background: rgba(4,23,46, 0.8);

            @media (max-width: ${({ theme }) => theme.md_screen}){
                margin-top: 70px;
            }


            span:hover {
                opacity: .4;
            }

        }
        .overlay2{
            top: 60px;
            left: 0;
            font-weight: 600;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: ${({ theme }) => theme.transition};
            transform:  translateY(0);
            
            @media (max-width: ${({ theme }) => theme.md_screen}){
                transform:  translateY(-1000%);
                z-index: -1;
            }

            .left{
                width: 30%;
                max-width: 150px;
                min-width: 70px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .right{
                height: 100%;
                display: flex;
                width: 70%;
                justify-content: flex-end;
                align-items: center;
                font-weight: 600;

                .link {
                    color: #fff;
                }
            }
        }

        .overlay3 {
            top: 50%;
            height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;

            @media (max-width: ${({ theme }) => theme.sm_screen}){
                top: 45%;
            }

            div {
                font-size: 6vw;
                font-weight: 600;
                line-height: 6vw;
                margin-bottom: 10px;
                text-align: center;

                @media (min-width: ${({ theme }) => theme.xl_screen}){
                    font-size: 3rem;
                }
                @media (max-width: ${({ theme }) => theme.md_screen}){
                    font-size: 2.5rem;
                    line-height: 3rem;
                }
                @media (max-width: ${({ theme }) => theme.sm_screen}){
                    font-size: 2rem;
                    line-height: 3rem;
                }
            }

        }

        .overlay4 {
            top: 50%;
            left: 50%;
            transform: transalate(-50%, -50%);
            text-align: center;
            color: #fff;
            font-weight: 600;
            font-size: 2rem;
        }


        .swiper{
            transform: scale(1);
            animation: ${({ start }) => start === "true" ? 'scale-up' : 'scale-down'} 30s;
        }
        @keyframes scale-up {
            0% {transform: scale(1)}
            100% {transform: scale(1.2)}
        }
        @keyframes scale-down {
            0% {transform: scale(1)}
            100% {transform: scale(1)}
        }
        .slide {
            position: relative;
            z-index: 1;
            user-select: none;

            &::after {
                background: rgba(4,23,46, 0.75) none repeat;
                content: "";
                height: 100%;
                left: 0;
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 1;
            }
        }        
    }

    .none-home-page {
        height: calc(100vh - 200px);
        position: relative;
        z-index: 1;

        &::after {
            background: rgba(4,23,46, 0.75) none repeat;
            content: "";
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 1;
        }
    }
`

