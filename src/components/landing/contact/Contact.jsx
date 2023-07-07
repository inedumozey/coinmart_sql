import React, { useContext } from 'react'
import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Email from '../../Email';
import Phone from '../../Phone';
import { Context } from '../../../context/Context';


export default function Contact() {
    const { contact } = useContext(Context)

    return (
        <Wrapper>
            <Card Icon={PhoneAndroidIcon}>
                <div><Phone /></div>
                <div>Monday-Friday (10am-18pm)</div>
            </Card>

            <Card Icon={MailOutlineIcon}>
                <div><Email /></div>
            </Card>

            <Card Icon={LocationOnIcon}>
                <div>{contact.address}</div>
            </Card>
            <div className="map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47926.40243216424!2d-86.34474672089843!3d41.34365539999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88115235b4754265%3A0xfd13c872ebff4944!2sPlymouth%2C%20IN%2046563%2C%20USA!5e0!3m2!1sen!2sng!4v1669653723195!5m2!1sen!2sng" style={{ border: '0', height: '100%', width: '100%' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </Wrapper>
    )
}

const Card = ({ Icon, children }) => {
    return (
        <CardStyle>
            <div className="icon">
                <Icon style={{ color: 'var(--yellow)', fontSize: '4rem' }} />
            </div>
            <div className="children">
                {children}
            </div>
        </CardStyle>
    )
}

const Wrapper = styled.div`
    width: 100vw;
    margin: auto;
    max-width: 1200px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    transition: ${({ theme }) => theme.transition};

    .map {
        width: 600px;
        height: 450px;
    }

    padding: 20px ${({ theme }) => theme.lg_padding};

    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 20px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 20px ${({ theme }) => theme.sm_padding};

        .map {
            width: 90vw;
        }
    }
`

const CardStyle = styled.div`
    width: 250px;
    min-hight: 50px;
    background: #fff;
    padding: 10px;
    margin: 10px;
    text-align: center;
    box-shadow: 2px 2px 5px #ddd, -2px -2px 5px #ddd;

    .icon {
        padding: 10px 0 20px 0;
    }
    .children {
        padding: 20px;
    }

    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90vw;
    }
`
