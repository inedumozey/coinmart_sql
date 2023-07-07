import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components'
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Context } from '../../../context/Context';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function AsideLinks({ isExpanded, setExpanded }) {
    const location = useLocation()
    const [expandInvestment, setExpandInvestment] = useState(false)
    const [expandDeposit, setExpandDeposit] = useState(false)
    const [expandWithdrawal, setExpandWithdrawal] = useState(false)
    const [expandReferral, setExpandReferral] = useState(false)
    const [expandNotification, setExpandNotification] = useState(false)
    const { admin } = useContext(Context);
    const { links } = admin

    const isVestmentActive = location.pathname.includes('/admin/investment');

    const isDepositActive = location.pathname.includes('/admin/deposit')

    const isWithdrawalActive = location.pathname.includes('/admin/withdrawal');

    const isReferralActive = location.pathname.includes('/admin/referral');
    const isNotificationActive = location.pathname.includes('/admin/notification');

    const dropdwonHeight = {
        investment: '100px',
        deposit: '50px',
        transfer: '50px',
        withdrawal: '150px',
        referral: '50px',
        notification: '100px'
    }


    return (
        <Wrapper
            isExpanded={isExpanded}
            expandDeposit={expandDeposit}
            expandWithdrawal={expandWithdrawal}
            expandInvestment={expandInvestment}
            expandReferral={expandReferral}
            expandNotification={expandNotification}
            dropdwonHeight={dropdwonHeight}
        >
            {
                links.links?.map((link, i) => {
                    return <div key={i} className='linkWrapper'>
                        <Link
                            style={{
                                color: '#fff'
                            }}
                            title={link.name}
                            to={link.url}
                            className={location.pathname.includes(link.url) ? 'link activeLink' : 'link'}>
                            <div className="icon1">
                                <link.icon className='icon' />
                            </div>
                            <div className="name">{link.name}</div>
                        </Link>
                    </div>
                })
            }

            {/* investment */}
            <div className='linkWrapper' onClick={() => setExpandInvestment(!expandInvestment)}>
                <Link title="Investment" className={isVestmentActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        Investment
                        <div className="icon">
                            {
                                expandInvestment ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>
                <div className="investment-dropdwon-menu">
                    {
                        links.investmentLinks?.map((link, i) => {
                            return <Link
                                title={link.name}
                                key={i}
                                onClick={() => setExpanded(true)}
                                to={link.url}
                                className={location.pathname === link.url ? 'link active-link' : 'link'}
                            >
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>

            {/* Deposit */}
            <div className='linkWrapper' onClick={() => setExpandDeposit(!expandDeposit)}>
                <Link title="Deposit" className={isDepositActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        Deposit
                        <div className="icon">
                            {
                                expandDeposit ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>
                <div className="deposit-dropdwon-menu">
                    {
                        links.depositLinks?.map((link, i) => {
                            return <Link
                                onClick={() => setExpanded(true)}
                                title={link.name}
                                key={i}
                                to={link.url}
                                className={location.pathname === link.url ? 'link active-link' : 'link'}
                            >
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>

            {/* Withdrawal */}
            <div className='linkWrapper' onClick={() => setExpandWithdrawal(!expandWithdrawal)}>
                <Link title="Withdrawal" className={isWithdrawalActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        Withdrawal
                        <div className="icon">
                            {
                                expandWithdrawal ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>
                <div className="withdrawal-dropdwon-menu">
                    {
                        links.withdrawalLinks?.map((link, i) => {
                            return <Link
                                onClick={() => setExpanded(true)}
                                title={link.name}
                                key={i}
                                to={link.url}
                                className={location.pathname === link.url ? 'link active-link' : 'link'}
                            >
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>

            {/* Referral */}
            <div className='linkWrapper' onClick={() => setExpandReferral(!expandReferral)}>
                <Link title="Referral" className={isReferralActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <PersonIcon className='icon' />
                    </div>
                    <div className="name">
                        Referral
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
                                onClick={() => setExpanded(true)}
                                title={link.name}
                                key={i}
                                to={link.url}
                                className={location.pathname === link.url ? 'link active-link' : 'link'}
                            >
                                <div className="icon1">
                                    <link.icon className='icon' />
                                </div>
                                <div className="name">{link.name}</div>
                            </Link>
                        })
                    }
                </div>
            </div>

            {/* notification */}
            <div className='linkWrapper' onClick={() => setExpandNotification(!expandNotification)}>
                <Link title="NotificationS" className={isNotificationActive ? 'link activeLink' : 'link'}>
                    <div className="icon1">
                        <NotificationsIcon className='icon' />
                    </div>
                    <div className="name">
                        Notification
                        <div className="icon">
                            {
                                expandNotification ? < ArrowDropUpIcon /> : <ArrowDropDownIcon />
                            }
                        </div>
                    </div>
                </Link>

                <div className="notification-dropdwon-menu">
                    {
                        links.notificationLinks?.map((link, i) => {
                            return <Link
                                onClick={() => setExpanded(true)}
                                title={link.name}
                                key={i}
                                to={link.url}
                                className={location.pathname === link.url ? 'link active-link' : 'link'}
                            >
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

        .investment-dropdwon-menu {
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
            height : ${({ expandInvestment, dropdwonHeight }) => expandInvestment ? dropdwonHeight.investment : '0px'};
            opacity : ${({ expandInvestment }) => expandInvestment ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }

        .deposit-dropdwon-menu {
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
            height : ${({ expandDeposit, dropdwonHeight }) => expandDeposit ? dropdwonHeight.deposit : '0px'};
            opacity : ${({ expandDeposit }) => expandDeposit ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }

        .transfer-dropdwon-menu {
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
            height : ${({ expandTransfer, dropdwonHeight }) => expandTransfer ? dropdwonHeight.transfer : '0px'};
            opacity : ${({ expandTransfer }) => expandTransfer ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }

        .withdrawal-dropdwon-menu {
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
            height : ${({ expandWithdrawal, dropdwonHeight }) => expandWithdrawal ? dropdwonHeight.withdrawal : '0px'};
            opacity : ${({ expandWithdrawal }) => expandWithdrawal ? '1' : '0'};
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
            height : ${({ expandReferral, dropdwonHeight }) => expandReferral ? dropdwonHeight.referral : '0px'};
            opacity : ${({ expandReferral }) => expandReferral ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }

        .notification-dropdwon-menu {
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
            height : ${({ expandNotification, dropdwonHeight }) => expandNotification ? dropdwonHeight.notification : '0px'};
            opacity : ${({ expandNotification }) => expandNotification ? '1' : '0'};
            transition: ${({ theme }) => theme.transition};
        }
    }
`