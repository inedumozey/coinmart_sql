import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';

export default function Section() {
    const {
        home_page_section3_title,
        home_page_section3_body,
        home_page_section3_data
    } = useContext(Context)

    const [load, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])


    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center' }}>{home_page_section3_title}</h3>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>{home_page_section3_body}</div>
            <Flexbox>
                {
                    home_page_section3_data?.map((item, i) => {
                        return (
                            <CardStlye key={i}>
                                <div className="icon">
                                    <div className='icon-wrapper'>
                                        <item.icon style={{ fontSize: '3rem' }} />
                                    </div>
                                </div>
                                <div className='right'>
                                    <div className="title">{item.title}</div>
                                    <div className="body">{item.body}</div>
                                </div>
                            </CardStlye>
                        )
                    })
                }
            </Flexbox>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    padding: 20px 0;
`

const Flexbox = styled.div`
    width: 100%;
    margin: auto;
    max-width: 1200px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`

const CardStlye = styled.div`
    min-hight: 50px;
    transition: ${({ theme }) => theme.transition};
    width: 350px;
    background: #fff;
    margin: 10px;
    cursor: default;
    border: 1px solid var(--yellow);
    display: flex;
    justify-content: center;
    padding: 30px 10px 30px 10px;
    align-items: flex-start;

    .icon {
        width: 200px;
        display: flex;
        color: var(--yellow);
        justify-content: center;

        .icon-wrapper {
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 1px solid;
        }
    }
    .right {
        padding: 0 10px;
    }
    .title {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    &:hover {
        background: var(--yellow);
        color: #fff;

        .icon {
            color: #fff;
        }
    }
    @media (max-width: ${({ theme }) => theme.md_screen}){
        width: 60vw;
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90vw;
    }
`