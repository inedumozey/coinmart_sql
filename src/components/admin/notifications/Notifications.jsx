import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Preview from '../../notifications/Preview';
import Cookies from 'js-cookie';
import apiClass from '../../../utils/api';
import { useNavigate } from 'react-router-dom'
import Skeleton from '../../Skeleton';

const api = new apiClass()

export default function Notifications() {
    const { notifications, fetchDataErrorMsg, noDataMsg } = useContext(Context);
    const navigate = useNavigate();

    const [load, setLoading] = useState(true)

    const {
        fetchingNotification_admin,
        setFetchingNotification_admin,
        fetchNotificationSuccess_admin,
        setFetchNotificationSuccess_admin,
        notificationData_admin,
        setNotificationData_admin
    } = notifications

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        setFetchingNotification_admin(true);

        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchNotification_admin(setFetchingNotification_admin, setFetchNotificationSuccess_admin, setNotificationData_admin)
            }, 2000);
        }
        else {
            setTimeout(() => {
                api.fetchNotification_admin(setFetchingNotification_admin, setFetchNotificationSuccess_admin, setNotificationData_admin)
            }, 1000);
        }
    }, [])

    const openNotification = (id) => {
        // open notification
        navigate(`/admin/notifications/${id}`)

    }

    return (
        <Wrapper>
            {
                load || fetchingNotification_admin ?
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
                    !fetchNotificationSuccess_admin ?
                        <div style={{ color: 'red', fontSize: '.7rem' }} className="center">{fetchDataErrorMsg}</div> :

                        notificationData_admin?.length ?
                            notificationData_admin.map((item, i) => {
                                return <SubWrapper
                                    key={i}
                                    onClick={() => openNotification(item._id)}>
                                    <Preview data={item} type="read" />
                                </SubWrapper>
                            }) : <div className="tag">{noDataMsg}</div>
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