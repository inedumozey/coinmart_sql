import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';
import Btn from '../../../Btn/Btn';
import { useNavigate } from 'react-router-dom';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';


export default function Section() {
    const { about_page_section1_data } = useContext(Context);
    const navigate = useNavigate()

    return (
        <Wrapper>
            <Flexbox>
                <CardStlye className='left'>
                    <div className="video">
                        <div onClick={() => navigate('/video/about/55474857575')} className="play">
                            <PlayCircleFilledWhiteIcon style={{ color: 'var(--blue)', fontSize: '3rem' }} />
                        </div>
                        <img src="/ab.jpg" alt="" />
                    </div>
                </CardStlye>
                <CardStlye className='right'>
                    {about_page_section1_data?.map((item, i) => {
                        return (
                            <div key={i}>
                                <h2 style={{ textAlign: 'center' }}>{item.title}</h2>
                                <p>{item.discription}</p>
                            </div>
                        )
                    })}

                    <Btn url="/about-us">LEARN MORE</Btn>
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

    .left {
        width: 500px;
        padding: 10px;
        display: flex;
        justify-content: center;
        
        .video {
            width: 100%;
            position: relative;

            .play {
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
                width: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                cursor: pointer;
                align-items: center;

                &:hover {
                    opacity: .4;
                }
            }

            &::after {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 50%;
                height: 100%;
                content: "";
                background: rgba(6,34,65,0.60) none repeat scroll 0 0;
            }

            img {
                width: 100%;
                object-fit: contain;
            }
        }
    }
    
    .right {
        width: calc(100% - 500px - 10px);
        text-align: justify;
    }

    @media (max-width: ${({ theme }) => theme.lg_screen}){
        .left {
            width: 400px
        }
        .right {
            width: calc(100% - 400px - 10px);
        }
    }

    @media (max-width: ${({ theme }) => theme.md_screen}){
        .left {
            width: 90vw;
            margin: auto;
        }
        .right {
            width: 90vw;
            margin: auto;
        }
    }

 
`

const CardStlye = styled.div`
    min-hight: 50px;
    transition: ${({ theme }) => theme.transition};
    min-height: 180px;
`