import { useContext } from 'react'
import styled from 'styled-components'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Context } from '../../../context/Context';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CountdownTimer from '../../../components/contest/CountdownTimer';
import { Link } from 'react-router-dom';


export default function Header({ isExpanded, setExpanded, headerHeight }) {
    const { user, config } = useContext(Context);
    const { profile } = user;
    const { newNotificationCounts } = profile

    return (
        <HeaderStyle isExpanded={isExpanded} headerHeight={headerHeight} >
            {
                config.configData.allowReferralContest ? <div className="contest">
                    <CountdownTimer stopDate={config.configData.referralContestStops} startDate={config.configData.referralContestStarts} />
                </div> : ''
            }

            {
                newNotificationCounts > 0 ?
                    <Link className="notification-icon" to="/dashboard/notifications">
                        <div className="notification-counts">{newNotificationCounts}</div>
                        <NotificationsActiveIcon style={{ color: 'red' }} />
                    </Link> :
                    <Link className="notification-icon" to="/dashboard/notifications">
                        <NotificationsIcon />
                    </Link>
            }

            <div style={{ fontSize: '.9rem', fontWeight: 'bold' }}>User Dashboard</div>

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

    padding: 15px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 15px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 15px ${({ theme }) => theme.sm_padding};
    }

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

    .notification-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        .notification-counts {
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
            font-size: .7rem;
        }
    }
`