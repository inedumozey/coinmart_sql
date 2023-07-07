import React from 'react';
import styled from 'styled-components';


export default function Skeleton({ type = "" }) {
    return <SkeletonStyle type={type}></SkeletonStyle>
}

const SkeletonStyle = styled.div`
    width: 100%;
    height: 100%;
    border-radius: ${({ type }) => type !== 'round' ? '' : '50%'};
    animation: skeleton 1s linear infinite alternate;

    @keyframes skeleton {
        0% { background: hsl(200 20% 60%); }
        100% { background: hsl(200 20% 85%); }
    }
`