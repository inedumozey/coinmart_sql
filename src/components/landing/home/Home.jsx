import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../context/Context';
import Section_1 from './section_1/Section';
import Section_2 from './section_2/Section';
import Section_3 from './section_3/Section';
import Section_4 from './section_4/Section';
import Section_5 from './section_5/Section';
import Section_6 from './section_6/Section';
import Section_7 from './section_7/Section';
import Section_8 from './section_8/Section';
import Section_9 from './section_9/Section';
import styled from 'styled-components';
import apiClass from '../../../utils/api';


const api = new apiClass()

export default function Home() {
    const { config, latestData } = useContext(Context);

    const {
        setFetchLatestWithdrawal,
        setFetchLatestWithdrawalSuccess,
        setLatestWithdrawalData,

        setFetchLatestDeposit,
        setFetchLatestDepositSuccess,
        setLatestDepositData
    } = latestData

    useEffect(() => {
        setFetchLatestWithdrawal(true)
        setFetchLatestDeposit(true);

        api.fetchLatestDeposit(setFetchLatestDeposit, setFetchLatestDepositSuccess, setLatestDepositData)
        api.fetchLatestWithdrawal(setFetchLatestWithdrawal, setFetchLatestWithdrawalSuccess, setLatestWithdrawalData,)
    }, []);


    return (
        <Wrapper>
            <SubWrapper>
                <Section_1 data={config.configData} />
            </SubWrapper>

            <SubWrapper bg="var(--gray-light2)">
                <Section_2 />
            </SubWrapper>

            <SubWrapper >
                <Section_3 />
            </SubWrapper>

            <SubWrapper className='image-bg bg1'>
                <Section_4 />
            </SubWrapper>

            <SubWrapper bg="var(--gray-light2)">
                <Section_5 />
            </SubWrapper>

            <SubWrapper>
                <Section_6 config={config.configData} />
            </SubWrapper>

            <SubWrapper className='image-bg bg2'>
                <Section_7 />
            </SubWrapper>

            <SubWrapper bg="var(--gray-light2)">
                <Section_8 />
            </SubWrapper>

            <SubWrapper>
                <Section_9 />
            </SubWrapper>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    transition: ${({ theme }) => theme.transition};

    .tag {
        font-size: .65rem;
        color: red;
    }

    .bg1 {background: url('/office.jpg')}
    .bg2 {
        background: rgba(6,34,65,0.60) url('/hero3.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        background-blend-mode: darken;
    }
    .image-bg {
        height: 70vh;
        background-size: cover;
    }
    .bg2 {
        height: 50vh;
    }
`
const SubWrapper = styled.div`
    min-height: 10vh;
    background: ${({ bg }) => bg};
    padding: 20px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 20px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 20px ${({ theme }) => theme.sm_padding};
    }
}

`