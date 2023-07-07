import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '../../../../context/Context';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { Link } from 'react-router-dom'

export default function Section() {
    const { contact } = useContext(Context);

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center' }}>How {contact.name} {contact.invest} Works</h3>
            <Flexbox>
                <CardStlye>
                    <Link to="/auth/signup">
                        <div className="icon">
                            <div className='icon-wrapper'>
                                <PhoneAndroidIcon style={{ fontSize: '3rem', color: 'var(--yellow)' }} />
                                <div className="tag tag1">01</div>
                            </div>
                        </div>
                        <div className="title">Register With Us</div>
                    </Link>
                </CardStlye>

                <CardStlye>
                    <Link to="/auth/signup">
                        <div className="icon">
                            <div className='icon-wrapper'>
                                <PhoneAndroidIcon style={{ fontSize: '3rem', color: 'var(--purple2)' }} />
                                <div className="tag tag2">02</div>
                            </div>
                        </div>
                        <div className="title">Invest In A Plan</div>
                    </Link>
                </CardStlye>

                <CardStlye>
                    <Link to="/auth/signup">
                        <div className="icon">
                            <div className='icon-wrapper'>
                                <PhoneAndroidIcon style={{ fontSize: '3rem', color: 'var(--green2)' }} />
                                <div className="tag tag3">03</div>
                            </div>
                        </div>
                        <div className="title">Get Profit</div>
                    </Link>
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
    min-height: 50vh;;
    max-width: 1200px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
`

const CardStlye = styled.div`
    width: 200px;
    height: 200px;
    margin: 10px;
    text-align: center;

    transition: ${({ theme }) => theme.transition};

    .icon {
        width: 200px;
        display: flex;
        color: var(--yellow);
        justify-content: center;

        .icon-wrapper {
            width: 100px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            position: relative;
            cursor: pointer;
            baclground: #fff;
            box-shadow: 0 5px 25px rgb(0 0 0 / 10%);

            .tag {
                position: absolute;
                top: -5px;
                left: -5px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #fff;
                display: flex;
                font-size: 1rem;
                justify-content: center;
                align-items: center;
            }
    
            .tag1 {background: var(--yellow)};
            .tag2 {background: var(--purple2)};
            .tag3 {background: var(--green2)};
    
        }
    }

    .title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-top: 40px;
    }
`