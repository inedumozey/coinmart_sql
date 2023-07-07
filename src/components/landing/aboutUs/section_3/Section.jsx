import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';
import Btn from '../../../Btn/Btn';


export default function Section() {
    const {
        about_page_section3_text
    } = useContext(Context)


    return (
        <Wrapper>
            <h3>{about_page_section3_text}</h3>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Btn
                    link={true}
                    url="/auth/signup"
                >Open New Account</Btn>
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
