import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';
import Btn from '../../../Btn/Btn';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';

import { EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/lazy";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Thumbs } from 'swiper';

// import required modules
import {
    Pagination,
    Autoplay,
    Lazy
} from "swiper/core";

export default function Section() {
    const {
        home_page_section9_title,
        home_page_section9_body,
        home_page_section9_data
    } = useContext(Context)

    const [load, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])


    return (
        <Wrapper>
            <Flexbox>
                <CardStlye className='left'>
                    <h3>{home_page_section9_title}</h3>
                    <div style={{ margin: '15px 0' }}>{home_page_section9_body}</div>
                    <div>
                        <Btn link={true} url="auth">Sign Up</Btn>
                    </div>
                </CardStlye>
                <CardStlye className='right'>
                    <Swiper
                        style={{
                            "--swiper-navigation-color": "#fff",
                            "--swiper-pagination-color": "#fff",
                        }}
                        lazy={true}
                        pagination={{
                            clickable: true,
                        }}
                        loop
                        autoplay={{
                            delay: 4000,
                            pauseOnMouseEnter: true
                        }}
                        modules={[Lazy, Pagination, EffectFade, Autoplay]}
                        className="mySwiper"

                    >
                        {home_page_section9_data?.map((item, i) => {
                            return (
                                <SwiperSlide key={i}>
                                    <div className='text'>{item.text}</div>
                                    <div style={{ margin: ' 5px 20px' }}>
                                        {function () {
                                            const stars = Array(item.ratings).fill(0);
                                            return stars.map((data, k) => {
                                                return <StarIcon key={k} className="stars" />
                                            })
                                        }()}
                                    </div>

                                    <div className="wraper">
                                        <div className="img-wrapper">
                                            <img src={item.image} alt="" />
                                        </div>
                                        <div className="metadata">
                                            <span style={{ fontWeight: 600 }}>{item.author}</span> - {" "}
                                            <span style={{ color: 'var(--yellow' }}>{item.role}</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </CardStlye>
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
    justify-content: space-between;
    flex-wrap: wrap;

    .left {
        width: 300px;
    }
    .right {
        width: calc(100% - 300px - 50px);
    }

    @media (max-width: ${({ theme }) => theme.md_screen}){
        .left {
            width: 90vw;
        }
        .right {
            width: 90vw;
        }
    }
`

const CardStlye = styled.div`
    min-hight: 50px;
    transition: ${({ theme }) => theme.transition};
    background: #fff;
    min-height: 180px;

    .swiper {
        width: 100%;
        height: 100%;
    }

    .swiper-slide {
        padding: 20px;

        .stars {
            color: var(--yellow);
            font-size: 1rem;
        }

        .text {
            box-shadow: 0 5px 25px rgb(0 0 0 / 10%);
            padding: 20px;
        }

        .wraper {
            margin-top: 20px;
            display: flex;
            align-items: flex-end;
            padding: 20px;

            .img-wrapper {
                width: 95px;
                height: 95px;
                border-radius: 50%;
                border: 1px solid var(--yellow);
            }

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
`