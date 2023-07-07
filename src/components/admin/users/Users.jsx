import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context'
import apiClass from '../../../utils/api'
import Skeleton from '../../Skeleton'
import UserData from './UserData'

const api = new apiClass()

export default function Users() {
    const { config, admin, fetchDataErrorMsg, noDataMsg } = useContext(Context);

    const {
        fetchingUsers_initial,
        setFetchingUsers_initial,
        fetchingUsersSuccess_initial,
        setFetchingUsersSuccess_initial,
        userData,
        setUserData
    } = admin.userMgt


    const [load, setLoading] = useState(true)

    useEffect(() => {
        setFetchingUsers_initial(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.getUsers(setFetchingUsers_initial, setFetchingUsersSuccess_initial, setUserData)
            }, 2000);
        }
        else {
            api.getUsers(setFetchingUsers_initial, setFetchingUsersSuccess_initial, setUserData)
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <Wrapper>
            {
                fetchingUsers_initial || load || !config.configData ?
                    <Skeletons>
                        <div className="header">
                            <div className="stat-wrapper">
                                {
                                    [1, 2, 3, 4].map((item, i) => {
                                        return <div key={i} className="stat"><Skeleton /></div>
                                    })
                                }
                            </div>
                            <div className="search-wrapper">
                                <div className="search"><Skeleton /></div>
                            </div>

                        </div>
                        <div className="table">
                            {
                                [1, 2, 3, 4].map((item, i) => {
                                    return <div key={i} className="text"><Skeleton /></div>
                                })
                            }
                        </div>
                        <div className="view-more">
                            <div className="more"><Skeleton /></div>
                        </div>
                    </Skeletons> :
                    !fetchingUsersSuccess_initial ? <div className="tag">{fetchDataErrorMsg}</div> :
                        userData.data.length < 1 ? <div className="tag">{noDataMsg}</div> :
                            <UserData />
            }
        </Wrapper>
    )
}


const Wrapper = styled.div`
    margin: auto;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
        }
    }
    
    .tag {
        font-size: .65rem;
        color: red;
    }
`

const Skeletons = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    box-shadow: 2px 2px 4px #ccc;

    .header {
        .stat {
            width: 70px;
            height: 30px;
            padding-bottom: 10px;
        }
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            height: 40px;
            width: 250px;
            max-width: 300px;
        }
    }

    .table {
        padding: 0;
        width: 100%;
        margin: 0px auto 10px auto;

        .text {
            width: 100%;
            height: 30px;
            margin: 20px 0;
            padding-bottom: 3px;
        }
    }

    .view-more {
        display: flex;
        height: 40px;
        justify-content: center;
        align-items: center;

        .more{
            border-radius: 5px;
            height: 100%;
            width: 130px;
        }
    }

`