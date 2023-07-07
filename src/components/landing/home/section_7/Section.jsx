import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';
import Btn from '../../../Btn/Btn';


export default function Section() {
    const {
        home_page_section7_text
    } = useContext(Context)


    return (
        <Wrapper>
            <h3>{home_page_section7_text}</h3>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Btn
                    link={true}
                    url="/auth/signup"
                >Sign Up Now</Btn>
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    padding: 10px;
    height: 50vh;;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-itmes: center;
    text-align: center;
    color: #fff;   
`
