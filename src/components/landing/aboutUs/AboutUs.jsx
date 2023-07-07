import React from 'react';
import Section_1 from './section_1/Section';
import Section_2 from './section_2/Section';
import Section_3 from './section_3/Section';
import Section_4 from './section_4/Section';
import styled from 'styled-components';

export default function Home() {


    return (
        <Wrapper>
            <SubWrapper>
                <Section_1 />
            </SubWrapper>

            <SubWrapper bg="var(--gray-light2)">
                <Section_2 />
            </SubWrapper>

            <SubWrapper className='image-bg bg2'>
                <Section_3 />
            </SubWrapper>

            <SubWrapper bg="var(--gray-light2)">
                <Section_4 />
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