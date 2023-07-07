import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';
import Btn from '../../../Btn/Btn';

export default function Section() {
    const {
        about_page_section4_part1_title,
        about_page_section4_part1_body,
        about_page_section4_part1_body2,
        about_page_section4_part1_data,

        about_page_section4_part2_title,
        about_page_section4_part2_body,
        about_page_section4_part2_data
    } = useContext(Context)

    return (
        <Wrapper>
            <Flexbox>
                <CardStlye className='image'>
                    <div className="img">
                        <img src="/b2.jpg" alt="" />
                    </div>
                </CardStlye>

                <CardStlye className='text'>
                    <h3 style={{ textAlign: 'center' }}>{about_page_section4_part1_title}</h3>
                    <div style={{ textAlign: 'justify', margin: '15px' }}>{about_page_section4_part1_body}</div>

                    <div style={{ textAlign: 'center', margin: '15px', fontSize: '1rem' }}>{about_page_section4_part1_body2}</div>

                    {about_page_section4_part1_data?.map((item, i) => {
                        return (
                            <ul key={i}>
                                <div className="mark">&#10004;</div>
                                <li>{item.item} </li>
                            </ul>
                        )
                    })}

                    <Btn url="/about-us">GET STARTED NOW</Btn>
                </CardStlye>

                <CardStlye className='text'>
                    <h3 style={{ textAlign: 'center' }}>{about_page_section4_part2_title}</h3>
                    <div style={{ textAlign: 'justify', margin: '15px' }}>{about_page_section4_part2_body}</div>

                    {about_page_section4_part2_data?.map((item, i) => {
                        return (
                            <ul key={i}>
                                <div className="mark">&#10004;</div>
                                <li> {item.item}</li>
                            </ul>
                        )
                    })}

                    <Btn url="/about-us">LEARN MORE</Btn>
                </CardStlye>

                <CardStlye className='image'>
                    <div className="img">
                        <img src="/b7.png" alt="" />
                    </div>
                </CardStlye>

            </Flexbox>
        </Wrapper>
    )
}


const Wrapper = styled.div`
   
`

const Flexbox = styled.div`
    width: 100%;
    margin: 20px auto 10px auto;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .image {
        width: 400px;
        padding: 10px;
        display: flex;
        justify-content: center;

        .img {
            width: 100%;
            height: 300px;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
    .text {
        width: calc(100% - 400px - 10px);
        text-align: justify;

        div {
            margin: 10px auto;
        }

        ul {
            position: relative;
            cursor: default;
            margin-left: 10px;

            li {
                display: block;
            }

            .mark{
                position: absolute;
                left: 0px;
                top: 0%;
                transform: translateY(-50%);
                font-family: themify;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                border-radius: 50px;
                font-size: 12px;
                color: #fff;
                background: var(--yellow);
            }
        }
    }

    @media (max-width: ${({ theme }) => theme.md_screen}){
        .image {
            width: 90vw;
        }
        .text {
            width: 90vw;
        }
    }
`

const CardStlye = styled.div`
   margin: 30px auto;
    transition: ${({ theme }) => theme.transition};
    min-height: 180px;
`