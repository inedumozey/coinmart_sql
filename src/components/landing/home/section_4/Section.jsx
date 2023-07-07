import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';

export default function Section() {
    const {
        home_page_section4_quote,
        home_page_section4_quote_by,
    } = useContext(Context)


    return (
        <Wrapper>
            <Card>
                <q>{home_page_section4_quote}</q>
                <div>{home_page_section4_quote_by}</div>
            </Card>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-itmes: center;
   
`

const Card = styled.div`
    width: 500px;
    margin: auto;
    border-radius: 5px;
    background: rgba(255, 255, 255, .8);
    box-shadow: 2px 2px 4px rgba(0,0,0,.4), 2px 2px 4px rgba(0,0,0,.4);
    padding: 30px;

    q {
        font-weight: 600;
        font-size: 1.3rem
    }

    div {
        font-size: 1.2rem;
        padding: 10px 0;
        font-weight: 400;
    }

    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90vw;
    }
`