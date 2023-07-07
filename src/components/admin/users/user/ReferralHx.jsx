import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import ReferralHistoryData from './ReferralHistoryData';


export default function ReferralHx({ data }) {
    const { admin, config } = useContext(Context);

    return (
        <Wrapper>
            <div>downlines: <span style={{ color: 'red' }}>{data.length}</span> </div>
            <ReferralHistoryData referralHxData={data} />
        </Wrapper>
    )
}

const Wrapper = styled.div`

`
