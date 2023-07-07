import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';

export default function Section() {
    const { about_page_section2_data } = useContext(Context)

    return (
        <Wrapper>
            <Flexbox>
                {
                    about_page_section2_data?.map((item, i) => {
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
    position: relative;
    height: 200px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
    padding: 10px;
    flex-direction: column;


    .icon {
        width: 200px;
        display: flex;
        color: var(--yellow);
        justify-content: center;
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);

        .icon-wrapper {
            width: 70px;
            height: 70px;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 1px solid;
        }
    }
    .title {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    &:hover {
        .icon-wrapper  {
            background: var(--yellow);
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