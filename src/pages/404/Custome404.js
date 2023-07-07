import React from 'react'
import styled from 'styled-components'
import Image from 'react-bootstrap/Image';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Custome404() {
    const navigate = useNavigate();
    const time = 120000

    // navigate to home after timer has ellapsed
    setTimeout(() => {
        navigate('/')
    }, time)

    return (
        <Wrapper>

            <h2>Opps! 404</h2>
            <p className="text">But do not worry, you'll be redirected home in {time / 1000} seconds or <Link to="/">click here</Link> to go Home</p>
            <div className="img">
                <Image src='/404-3.png' alt="404" fluid />
            </div>
        </Wrapper >
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    border: 1px solid teal;

    .img {
        width: 30%;
        height: 30%;
        max-width: 200px;
        max-height: 200px;
        min-width: 100px;
        min-height: 100px;
    }

    h2 {
        color: #c10;
    }
    p {
        
    }

    a {
        color: blue;
         &:hover {
            opacity: .3;
         }
    }
`