import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Skeleton from '../../../Skeleton';
import HistoryData from './HistoryData';

const api = new apiClass()

export default function History() {
    const { investment, config, noDataMsg } = useContext(Context);

    const {
        investmentData_admin,
        setInvestmentData_admin,
        fetchingInvestments_admin,
        setFetchingInvestments_admin,
        setFetchInvestmentsMsg_admin,
    } = investment.invest;

    const [load, setLoading] = useState(true)

    useEffect(() => {
        setFetchingInvestments_admin(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.adminGetAllInvestments(setInvestmentData_admin, setFetchingInvestments_admin, setFetchInvestmentsMsg_admin)
            }, 2000);
        }
        else {
            api.adminGetAllInvestments(setInvestmentData_admin, setFetchingInvestments_admin, setFetchInvestmentsMsg_admin)
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    return (
        <Wrapper>
            {
                fetchingInvestments_admin || load || !config.configData ?
                    <Skeletons>
                        <div className="header">
                            {
                                [1, 2, 3].map((item, i) => {
                                    return <div key={i} className="stat"><Skeleton /></div>
                                })
                            }
                            <div className="search-wrapper">
                                <div className="search"><Skeleton /></div>
                            </div>
                        </div>
                        <div className="table">
                            {
                                [1, 2, 3].map((item, i) => {
                                    return <div key={i} className="text"><Skeleton /></div>
                                })
                            }
                        </div>
                    </Skeletons>
                    :
                    investmentData_admin?.length ?
                        <HistoryData data={investmentData_admin} /> :
                        <div className="tag">{noDataMsg}</div>
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
            grid-template-columns: repeat( auto-fit, minmax(170px, 1fr) );
        }
    }

    .skeleton {
        width: 80vw;
        margin: auto;
        height: 80vh;
        padding: 10px;
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
            width: 60px;
            height: 30px;
            padding-bottom: 10px;
        }
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            height: 30px;
            width: 40%;
            max-width: 300px;
            min-width: 200px;
        }
    }

    .table {
        padding: 0;
        width: 100%;
        margin: 0px auto 10px auto;
        margin-top: 10px;

        .text {
            width: 100%;
            height: 30px;
            margin: 4px 0;
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