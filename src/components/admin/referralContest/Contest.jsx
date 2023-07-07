import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context'
import apiClass from '../../../utils/api'
import Skeletons from '../../contest/Skeletons'
import ContestantData from '../../contest/ContestantData';
import ContestHeader from '../../contest/ContestHeader'

const api = new apiClass()

export default function Contest() {
    const { config, user, referralContest, fetchDataErrorMsg } = useContext(Context);

    const [load, setLoading] = useState(true)

    const { profileData } = user.profile

    const {
        fetchingContestants_initial,
        setFetchingContestants_initial,
        fetchingContestantSuccess,
        setFetchingContestantSuccess,
        contestantData,
        setContestantData,
    } = referralContest;

    useEffect(() => {
        setFetchingContestants_initial(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchContestants_initial(setFetchingContestants_initial, setFetchingContestantSuccess, setContestantData)
            }, 2000);
        }
        else {
            api.fetchContestants_initial(setFetchingContestants_initial, setFetchingContestantSuccess, setContestantData)
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
                load || fetchingContestants_initial || !config.configData ? <Skeletons /> :
                    !fetchingContestantSuccess ? <div className="tag">{fetchDataErrorMsg}</div> :
                        contestantData.length < 1 ?
                            <>
                                <ContestHeader data={contestantData} config={config} />
                            </> :
                            <ContestantData data={contestantData} profileData={profileData} />
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

    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            display: inline-block;
            margin-bottom: 10px;
            width: 40%;
            max-width: 300px;
            min-width: 200px;
    
            input {
                padding: 6px;
                border-radius: 5px;
                width: 100%;
                border: 1px solid #ccc;
        
                &: focus {
                    outline: none;
                }
            }
        }
    }
`