import styled from 'styled-components'
import React, { useState, useEffect, useContext } from 'react';
import Header from './header/Header';
import Aside from './aside/Aside';
import Cookies from 'js-cookie';
import { Context } from '../../context/Context';
import apiClass from '../../utils/api';
import Copyright from '../../components/Copyright';
import TickerTap from '../../components/tradeView/TickerTape';
import { useLocation } from 'react-router-dom'
import Typewriter from 'typewriter-effect';


const api = new apiClass();
const headerHeight = '63px'
const expandedAside = '240px'
const shrinkedAside = '75px'

export default function User({ children }) {
    const [isExpanded, setExpanded] = useState(true);
    const location = useLocation()
    const { user, movingText } = useContext(Context);
    const {
        setProfileData,
        profileData,
        setProfileLoading,
        setFetchProfileSuccess,
        setFetchProfileMsg,
        setNewNotificationCounts,
    } = user.profile;

    let currentRouteName;
    if (location.pathname.includes('/dashboard')) currentRouteName = "My Packages"
    if (location.pathname.includes('/dashboard/deposit')) currentRouteName = "Deposit"
    if (location.pathname.includes('/dashboard/transfer')) currentRouteName = "Transfer"
    if (location.pathname.includes('/dashboard/withdrawal')) currentRouteName = "Withdrawal"
    if (location.pathname.includes('/dashboard/referral-history')) currentRouteName = "Referral History"
    if (location.pathname.includes('/dashboard/referral-contest')) currentRouteName = "Referral Contest"
    if (location.pathname.includes('/dashboard/plans')) currentRouteName = "Plans"
    if (location.pathname.includes('/dashboard/notifications')) currentRouteName = "Notifications"
    if (location.pathname.includes('/dashboard/account')) currentRouteName = "Account"
    if (location.pathname.includes('/dashboard/verify-account')) currentRouteName = "Account Verification"
    if (location.pathname.includes('/dashboard/tickets')) currentRouteName = "Tickets"
    if (location.pathname.includes('/dashboard/transactions')) currentRouteName = "Transactions"
    if (location.pathname.includes('/dashboard/security')) currentRouteName = "Security";

    useEffect(() => {
        setNewNotificationCounts(profileData.newNotifications?.length);
    }, [profileData])


    useEffect(() => {
        // if accesstoken not there, refresh it before proceeding to get profile, otherwise, get profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchProfile(setProfileData, setProfileLoading, setFetchProfileSuccess, setFetchProfileMsg)
            }, 2000);
        }
        else {
            api.fetchProfile(setProfileData, setProfileLoading, setFetchProfileSuccess, setFetchProfileMsg)
        }

    }, [])

    return (
        <Wrapper>
            <Header
                headerHeight={headerHeight}
                isExpanded={isExpanded}
                setExpanded={setExpanded}
            />

            <Aside
                expandedAside={expandedAside}
                shrinkedAside={shrinkedAside}
                headerHeight={headerHeight}
                isExpanded={isExpanded}
                setExpanded={setExpanded}
            />

            <MainStyle
                shrinkedAside={shrinkedAside}
                headerHeight={headerHeight}
                isExpanded={isExpanded}
            >
                <MainContent headerHeight={headerHeight}>
                    <div className="main-header">
                        <div className="row text">
                            <h4 className="present-route">{currentRouteName}</h4>
                            <Typewriter
                                options={{
                                    strings: movingText,
                                    autoStart: true,
                                    loop: true,
                                }}
                            />
                        </div>

                        <div className="row trade-view">
                            <TickerTap />
                        </div>
                    </div>
                    <div className="main-body">
                        {children}
                    </div>
                </MainContent>
                <FooterStyle headerHeight={headerHeight}>
                    <Copyright height='100%' bg="transparent" />
                </FooterStyle>
            </MainStyle>
        </Wrapper>
    )
}




const Wrapper = styled.div`
    
`

const MainStyle = styled.div`;
    position: absolute;
    top: ${({ headerHeight }) => `calc(${headerHeight} - 5px)`};
    right: 400px;
    transition: ${({ theme }) => theme.transition};
    width:  ${({ shrinkedAside, isExpanded }) => isExpanded ? '100vw' : `calc(100vw - ${shrinkedAside} + 5px)`};
    align-items: center;
    background: var(--gray-pale);
    left: ${({ isExpanded }) => isExpanded ? `calc(${expandedAside} - 5px)` : `calc(${shrinkedAside} - 5px)`};

    @media (max-width: ${({ theme }) => theme.md_screen}){
        left: ${({ isExpanded }) => isExpanded ? `0` : `calc(${expandedAside} - 5px)`};
    }
`

const MainContent = styled.div`
    width: 100%;
    min-height: ${({ headerHeight }) => `calc(100vh - ${headerHeight} - ${headerHeight} + 5px)`};
    background: var(--gray-pale);

    .main-header {
        width: 100%;
        color: #fff;
        background: linear-gradient(to left, var(--blue) 0%, var(--blue2) 50% );

        .text {
            background: linear-gradient(to left, var(--blue) 0%, var(--blue2) 50% );
            height: 80px;
            padding: 15px ${({ theme }) => theme.lg_padding};
            @media (max-width: ${({ theme }) => theme.md_screen}){
                padding: 15px ${({ theme }) => theme.md_padding};
            }
            @media (max-width: ${({ theme }) => theme.sm_screen}){
                padding: 15px ${({ theme }) => theme.sm_padding};
            }
        }
    }
`
const FooterStyle = styled.div`
    width: 100%;
    height: ${({ headerHeight }) => headerHeight};
    background: var(--gray-light);

    a {
        color: inherit;
        text-decoration: none;

        &:hover {
            opacity:.6
        }
    };

    padding: 15px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 15px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 15px ${({ theme }) => theme.sm_padding};
    }
`