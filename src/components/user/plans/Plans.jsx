import React from 'react'
import styled from 'styled-components';
import InvestmentPlans from '../../investmentPlans/InvestmentPlans';

export default function Plans() {
    return (
        <Wrapper>
            <InvestmentPlans />
        </Wrapper>
    )
}


const Wrapper = styled.div`
    margin: auto;
    max-width: 1200px;
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
`