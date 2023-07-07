import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Cookies from 'js-cookie';
import apiClass from '../../../utils/api';
import { useNavigate } from 'react-router-dom'
import Skeleton from '../../Skeleton';
import FullData from '../../notifications/FullData';

const api = new apiClass()

export default function Notification({ id }) {
    const { notifications } = useContext(Context);

    const [load, setLoading] = useState(true)

    const {
        setSelectedNotification,
        selectedNotification,
        setFetchOneNotificationSuccess,
        fetchOneNotificationSuccess,
        setFetchingOneNotification,
        fetchingOneNotification,
    } = notifications

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])


    useEffect(() => {
        setFetchingOneNotification(true);

        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchOneNotification_admin(id, setFetchingOneNotification, setFetchOneNotificationSuccess, setSelectedNotification)
            }, 2000);
        }
        else {
            setTimeout(() => {
                api.fetchOneNotification_admin(id, setFetchingOneNotification, setFetchOneNotificationSuccess, setSelectedNotification)
            }, 1000);
        }
    }, [])

    return (
        <Wrapper>
            {
                load || fetchingOneNotification || !selectedNotification ?
                    [1].map((item, i) => {
                        return <SubWrapper key={i}>
                            <div className="title">
                                <div style={{ width: '50%', height: '20px', marginBottom: '10px' }}><Skeleton /></div>
                            </div>
                            <div className="title">
                                <div style={{ width: '30%', height: '10px' }}><Skeleton /></div>
                            </div>
                        </SubWrapper>
                    })
                    :
                    !fetchOneNotificationSuccess ?
                        <div style={{ color: 'red', fontSize: '.7rem' }} className="center">
                            Failed to fetch data! Please refresh
                        </div> : <FullData data={selectedNotification} />
            }

        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100vw;
    margin: auto;
    max-width: 800px;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    padding: 10px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 10px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 10px ${({ theme }) => theme.sm_padding};
    }

    .tag {
        font-size: .65rem;
        color: red;
    }
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px;
    width: 100%;
    cursor: pointer;
    margin: 10px auto;
    box-shadow: 2px 2px 5px #ccc;

    &:hover {
        opacity: .4;
    }

`