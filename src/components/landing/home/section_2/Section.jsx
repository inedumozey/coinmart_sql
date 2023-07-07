import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';
import InvestmentPlans from '../../../investmentPlans/InvestmentPlans';

export default function Section() {
    const { home_page_section2_title, home_page_section2_body } = useContext(Context)

    const [load, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])


    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center' }}>{home_page_section2_title}</h3>
            <div style={{ textAlign: 'center' }}>{home_page_section2_body}</div>
            <InvestmentPlans />
        </Wrapper>
    )
}


const Wrapper = styled.div`
    padding: 20px 0;
`