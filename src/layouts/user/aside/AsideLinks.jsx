import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components'
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Context } from '../../../context/Context';



export default function AsideLinks({ isExpanded, setExpanded }) {
    const location = useLocation()
    const [expandProfile, setExpandProfile] = useState(false)
    const [expandReferral, setExpandReferral] = useState(false)
    const { user } = useContext(Context);
    const { links, profile } = user;

    const isProfileActive = location.pathname.includes('dashboard/account');

    const isReferralActive = location.pathname.includes('dashboard/referral')

    return (
        <Wrapper
            isExpanded={isExpanded}
            expandProfile={expandProfile}
            expandReferral={expandReferral}
        >
            {/* My profile */}
            <div className='linkWrapper' onClick={() => setExpandProfile(!expandProfile)}>
                <Link title="My Profile" className={isProfileActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        My Profile
                        <div className="icon">
                            {
                                expandProfile ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>
                <div className="profile-dropdwon-menu">
                    {
                        links.profileLinks?.map((link, i) => {
                            return <Link
                                title={link.name}
                                key={i} to={link.url}
                                onClick={() => setExpanded(true)}
                                className={location.pathname.includes(link.url) ? 'link active-link' : 'link'}>
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>
            {
                links.links?.map((link, i) => {
                    return <div key={i} className='linkWrapper'>
                        <Link
                            title={link.name}
                            to={link.url}
                            onClick={() => setExpanded(true)}
                            className={location.pathname.includes(link.url) ? 'link activeLink' : 'link'}>
                            <div className="icon1">
                                {link.name === 'Notifications' && profile.newNotificationCounts > 0 ? <span style={{ color: '#fff', fontSize: '.7rem', position: 'absolute' }}>{profile.newNotificationCounts}</span> : ''}
                                <link.icon
                                    style={{
                                        color: link.name === 'Notifications' && profile.newNotificationCounts > 0 ? 'red' : '#fff'
                                    }}
                                    className='icon'
                                />
                            </div>
                            <div className="name">{link.name}</div>
                        </Link>
                    </div>
                })
            }

            {/* Referral */}
            <div className='linkWrapper' onClick={() => setExpandReferral(!expandReferral)}>
                <Link title="Referral" className={isReferralActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        Referrals
                        <div className="icon">
                            {
                                expandReferral ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>
                <div className="referral-dropdwon-menu">
                    {
                        links.referralLinks?.map((link, i) => {
                            return <Link
                                title={link.name}
                                key={i} to={link.url}
                                onClick={() => setExpanded(true)}
                                className={location.pathname.includes(link.url) ? 'link active-link' : 'link'}>
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>

        </Wrapper>
    )
}


const Wrapper = styled.div`
    transition: ${({ theme }) => theme.transition};

    .activeLink {
        opacity: .6;
    }

    .linkWrapper {
        transition: ${({ theme }) => theme.transition};
        overflow: hidden;
        margin-top: 5px;
        padding: 0 10px;
        box-shadow: 4px 4px 10px 0 rgba(0,0,0,.1),4px 4px 15px -5px rgba(104,97,206,.4);

        .link {
            background: var(--blue-deep);
            display: block;
            width: 100%;
            height: 47px;
            padding: 5px;
            border-radius: 5px;
            box-shadow: 4px 4px 10px 0 rgba(0,0,0,.1),4px 4px 15px -5px rgba(104,97,206,.4);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon1 {
                width: 30px;
                display: flex;
                height: 100%;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            .icon {
                font-size: 1.7rem;
                font-weight: 600;
            }

            .name {
                font-weight: 600;
                height: 100%;
                padding: 0 10px;
                justify-content: space-between;
                align-items: center;
                margin: 0 5px;
                width: calc(100% - 30px);

                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                display: ${({ isExpanded }) => isExpanded ? 'flex' : 'none'};
                @media (max-width: ${({ theme }) => theme.md_screen}){
                    display: ${({ isExpanded }) => !isExpanded ? 'flex' : 'none'};
                }
            }
        }

        .profile-dropdwon-menu {
            background: inherit;
            a {
                background: inherit;
                color: #555;
                display: block;
                width: 100%;
                border-radius: none;
                box-shadow: none;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                padding-left:  ${({ isExpanded }) => isExpanded ? '20px' : '0px'};

                @media (max-width: ${({ theme }) => theme.md_screen}){
                    padding-left:  ${({ isExpanded }) => !isExpanded ? '20px' : '0px'};
                }

                &:hover {
                    background: #ddd;
                }
            }

            .active-link {
                background: #ddd;
            }

            .icon {
                color: var(--blue-deep);
            }
            height : ${({ expandProfile }) => expandProfile ? '50px' : '0px'};
            opacity : ${({ expandProfile }) => expandProfile ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }

        .referral-dropdwon-menu {
            background: inherit;
            a {
                background: inherit;
                color: #555;
                display: block;
                width: 100%;
                border-radius: none;
                box-shadow: none;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                padding-left:  ${({ isExpanded }) => isExpanded ? '20px' : '0px'};

                @media (max-width: ${({ theme }) => theme.md_screen}){
                    padding-left:  ${({ isExpanded }) => !isExpanded ? '20px' : '0px'};
                }

                &:hover {
                    background: #ddd;
                }
            }

            .active-link {
                background: #ddd;
            }

            .icon {
                color: var(--blue-deep);
            }
            height : ${({ expandReferral }) => expandReferral ? '100px' : '0px'};
            opacity : ${({ expandReferral }) => expandReferral ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }
    }
`