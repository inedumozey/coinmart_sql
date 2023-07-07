import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Preview from '../../notifications/Preview';
import Cookies from 'js-cookie';
import Spinner_ from '../../spinner/Spinner';
import apiClass from '../../../utils/api';
import Skeleton from '../../Skeleton';
import { useNavigate } from 'react-router-dom'

const api = new apiClass()

export default function Notifications() {
    const { user, notifications, fetchDataErrorMsg, noDataMsg } = useContext(Context);
    const [selectedId, setSelectedId] = useState('');
    const navigate = useNavigate();
    const [sortedData_new, setSortedData_new] = useState([])
    const [sortedData_read, setSortedData_read] = useState([])

    const [load, setLoading] = useState(true)

    const {
        profileData,
        profileLoading,
        fetchProfileSuccess,
        setReadingNotification,
        readingNotification,
        setReadingNotificationSuccess,
        setProfileData,
        setProfileLoadingAgain
    } = user.profile;


    const {
        setSelectedNotification,
        setFetchOneNotificationSuccess
    } = notifications

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])


    useEffect(() => {
        const data_read = profileData?.readNotifications?.sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt == b.createdAt) return 0
        })

        const data_new = profileData?.newNotifications?.sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1
            if (a.createdAt < b.createdAt) return 1
            if (a.createdAt == b.createdAt) return 0
        })

        setSortedData_read(data_read)
        setSortedData_new(data_new)
    }, [profileData.readNotifications, profileData.newNotifications])

    const handleRead = (data) => {
        setSelectedId(data._id)
        setReadingNotification(true);


        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.readNotification_user(data, setReadingNotification, setReadingNotificationSuccess, setProfileData, setProfileLoadingAgain, navigate, setSelectedNotification, setFetchOneNotificationSuccess)
            }, 2000);
        }
        else {
            setTimeout(() => {
                api.readNotification_user(data, setReadingNotification, setReadingNotificationSuccess, setProfileData, setProfileLoadingAgain, navigate, setSelectedNotification, setFetchOneNotificationSuccess)
            }, 1000);
        }
    }

    const openNotification = (id) => {
        // open notification
        navigate(`/dashboard/notifications/${id}`)

    }

    return (
        <Wrapper>
            {
                load || profileLoading ?
                    [1, 2, 3].map((item, i) => {
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
                    !fetchProfileSuccess ?
                        <div style={{ color: 'red', fontSize: '.7rem' }} className="center">{fetchDataErrorMsg}</div> :

                        !profileData.newNotifications?.length && !profileData.readNotifications?.length ?
                            <div className="tag">{noDataMsg}</div> :
                            <>
                                {
                                    profileData.newNotifications?.length ?
                                        sortedData_new.map((item, i) => {
                                            return <SubWrapper
                                                key={i}
                                                onClick={() => handleRead(item)}
                                            >
                                                <Preview data={item} type="new" />
                                                {
                                                    selectedId === item._id && readingNotification ? <div className="loading"><Spinner_ size="sm" /></div> : ''
                                                }

                                            </SubWrapper>
                                        }) : ''
                                }

                                {
                                    profileData.readNotifications?.length ?
                                        sortedData_read.map((item, i) => {
                                            return <SubWrapper
                                                key={i}
                                                onClick={() => openNotification(item._id)}>
                                                <Preview data={item} type="read" />
                                            </SubWrapper>
                                        }) : ''
                                }
                            </>

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