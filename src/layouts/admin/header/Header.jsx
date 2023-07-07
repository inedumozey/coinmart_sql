import styled from 'styled-components'
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Context } from '../../../context/Context';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CountdownTimer from '../../../components/contest/CountdownTimer';

export default function Header({ isExpanded, setExpanded, headerHeight }) {
    const location = useLocation()
    const { user, config } = useContext(Context);

    let currentRouteName;
    if (location.pathname.includes('/admin/home')) currentRouteName = "Home"
    if (location.pathname.includes('/admin/users')) currentRouteName = "Users"

    if (location.pathname.includes('/admin/deposit')) currentRouteName = "Deposit"

    if (location.pathname.includes('/admin/transfer/config')) currentRouteName = "Transfer Config"
    if (location.pathname.includes('/admin/transfer/history')) currentRouteName = "Transfer History"

    if (location.pathname.includes('/admin/notifications')) currentRouteName = "Notifications"
    if (location.pathname === '/admin/notifications/send') currentRouteName = "Send Notifications"

    if (location.pathname.includes('/admin/investment/config')) currentRouteName = "Investment Config"
    if (location.pathname.includes('/admin/investment/plans')) currentRouteName = "Investment Plans"
    if (location.pathname.includes('/admin/investment/history')) currentRouteName = "Investment History"

    if (location.pathname.includes('/admin/withdrawal/config')) currentRouteName = "Withdrawal Config"
    if (location.pathname.includes('/admin/withdrawal/request')) currentRouteName = "Withdrawal Request"
    if (location.pathname.includes('/admin/withdrawal/rejected')) currentRouteName = "Rejected Withdrawal"
    if (location.pathname.includes('/admin/withdrawal/confirmed')) currentRouteName = "Successful Withdrawal"

    if (location.pathname.includes('/admin/referral/history')) currentRouteName = "Referral History"
    if (location.pathname.includes('/admin/referral/config')) currentRouteName = "Referral Config"
    if (location.pathname.includes('/admin/referral/contest')) currentRouteName = "Referral Contest"

    return (
        <HeaderStyle isExpanded={isExpanded} headerHeight={headerHeight} >
            {
                config.configData.allowReferralContest ? <div className="contest">
                    <CountdownTimer stopDate={config.configData.referralContestStops} startDate={config.configData.referralContestStarts} />
                </div> : ''
            }

            <div style={{ fontSize: '.9rem', fontWeight: 'bold' }}>Admin | {currentRouteName}</div>

            <div className="toggle lg-screen">
                <span onClick={() => setExpanded(!isExpanded)} className='shrink'>
                    <ArrowLeftIcon className='icon' />
                </span>
                <span onClick={() => setExpanded(!isExpanded)} className='expand'>
                    <ArrowRightIcon className='icon' />
                </span>
            </div>

            <div className="toggle sm-screen">
                <span onClick={() => setExpanded(!isExpanded)} className='shrink'>
                    <ArrowLeftIcon className='icon' />
                </span>
                <span onClick={() => setExpanded(!isExpanded)} className='expand'>
                    <ArrowRightIcon className='icon' />
                </span>
            </div>
        </HeaderStyle>
    )
}

const HeaderStyle = styled.div`
    width: 100%;
    height: ${({ headerHeight }) => headerHeight};
    color: #fff;
    font-weight: 600;
    background: var(--blue-deep);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    transition: ${({ theme }) => theme.transition};
    font-size: 1.5rem;
    text-align: center;
    box-shadow: 0 0 5px rgb(18 23 39 / 50%);
    z-index: 3;
    padding: 15px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 15px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 15px ${({ theme }) => theme.sm_padding};
    }

    .contest {
        position: absolute;
        top: 0;
        right: 0;
        font-size: .7rem;
        border: 1px solid red;
        padding: 0 10px;
        border-radius: 10px;
        text-align: center;
    }

    a {
        color: inherit;
        text-decoration: none;

        &:hover {
            opacity:.6
        }
    };

    .toggle {
        width: 35px;
        height: 35px;
        box-shadow: 0 0 5px rgb(18 23 39 / 50%), -0 -0 5px rgb(18 23 39 / 50%);
        background: inherit;;
        color: #fff;
        user-select: none;
        border-radius: 50%;
        font-size: .9rem;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        justify-content: center;
        align-items: center;
        cursor: pointer;
        
        .icon {
            color: #fff;
            font-size: 2rem;
        }

        .expand {
            display: ${({ isExpanded }) => isExpanded ? 'none' : 'block'};
        }

        .shrink {
            display: ${({ isExpanded }) => isExpanded ? 'block' : 'none'};
        }

        @media (max-width: ${({ theme }) => theme.md_screen}){

            .expand {
                display: ${({ isExpanded }) => isExpanded ? 'block' : 'none'};
            }

            .shrink {
                display: ${({ isExpanded }) => isExpanded ? 'none' : 'block'};
            }
        }

    }

    .sm-screen {
        display: none;
    }
    .lg-screen {
        display: flex;
    }
    @media (max-width: ${({ theme }) => theme.md_screen}){
        .lg-screen {
            display: none;
        }

        .sm-screen {
            display: flex;
        }
    }
`