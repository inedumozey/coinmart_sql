import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';
import { Link } from 'react-router-dom'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';

export default function Section() {
    const {
        home_page_section8_title,
        home_page_section8_body,
        home_page_section8_data
    } = useContext(Context);

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center' }}>{home_page_section8_title}</h3>
            <div style={{ textAlign: 'center' }}>{home_page_section8_body}</div>
            <Flexbox>
                {home_page_section8_data?.map((item, i) => {
                    return (
                        <CardStlye key={i}>
                            <Link to='/'>
                                <div className="title">{item.title}</div>
                                <div className="img">
                                    <img src={item.image} alt="" />
                                </div>
                                <div className="info">
                                    <div><PersonIcon className='icon' /> {item.author}</div>
                                    <div><CalendarMonthIcon className='icon' />
                                        {item.createdAt && new Date(item.createdAt).toLocaleString()}</div>
                                    <div><CommentIcon className='icon' /> {item.comment}</div>
                                </div>
                            </Link>
                        </CardStlye>
                    )
                })}
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
    min-height: 50vh;;
    max-width: 1200px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
`

const CardStlye = styled.div`
    width: 260px;
    margin: 10px;
    padding: 10px;
    text-align: center;
    background:  var(--gray-light2);;
    transition: ${({ theme }) => theme.transition};
    box-shadow: 0 5px 25px rgb(0 0 0 / 10%);
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .img {
        width: 100%; 
    }

    .title {
        text-align: center;
        padding: 10px;
        font-weight: bold;
        font-size: 1rem;
    }

    .info {
        height: 80px;
        background: var(--gray-light2);
        margin-top: 20px;
        text-align: left;
        font-size: .6rem;

        div {
            margin: 5px;
        }
    }

    .icon {
        color: var(--yellow);
        font-size: 1.2rem;
    }

    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90vw;
    }

    &:hover {
        color: var(--yellow);
        border-top: 2px solid var(--yellow);

    }
`