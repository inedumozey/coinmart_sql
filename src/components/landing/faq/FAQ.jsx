import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../context/Context';
import Btn from '../../Btn/Btn';
import apiClass from '../../../utils/api';
import Spinner_ from '../../spinner/Spinner';
import Accordion from 'react-bootstrap/Accordion';

const api = new apiClass()

export default function FAQ() {
    const {
        faq_title,
        faq_body,
        user
    } = useContext(Context)

    const [inp, setInp] = useState({
        subject: '',
        message: '',
        email: ''
    });

    const {
        setSendingQusMsg,
        sendingQusMsg
    } = user.contactUs;


    const submitForm = (e) => {
        e.preventDefault();
        setSendingQusMsg(true);
        api.sendAdminQuestion(inp, setSendingQusMsg, setInp)
    }



    return (
        <Wrapper>
            <h4 style={{ textAlign: 'center' }}>{faq_title}</h4>
            <div style={{ textAlign: 'center' }}>{faq_body}</div>
            <Flexbox>
                <CardStlye className='left'>
                    <AccordionWrap />
                </CardStlye>
                <CardStlye className='right'>
                    <h5 style={{ textAlign: 'center', margin: '20px 0 20px 0' }}>Have any Question?</h5>
                    <form onSubmit={submitForm}>
                        <input
                            placeholder='Email'
                            value={inp.email || ''}
                            onChange={(e) => setInp({ ...inp, email: e.target.value })}
                        />
                        <input
                            placeholder='Subject'
                            value={inp.subject || ''}
                            onChange={(e) => setInp({ ...inp, subject: e.target.value })}
                        />
                        <textarea
                            className='textarea'
                            placeholder='Message'
                            value={inp.message || ''}
                            onChange={(e) => setInp({ ...inp, message: e.target.value })}
                        />

                        <div className='text-center text-md-start mt- pt-2'>
                            <Btn disabled={sendingQusMsg} link={false}>
                                {sendingQusMsg ? <Spinner_ size="sm" /> : "Send"}
                            </Btn>
                        </div>
                    </form>
                </CardStlye>
            </Flexbox>
        </Wrapper>
    )
}


function AccordionWrap() {
    const { faq_data } = useContext(Context)

    return (
        <Accordion defaultActiveKey={0}>
            {faq_data?.map((item, i) => {
                return (
                    <Accordion.Item key={i} eventKey={i}>
                        <Accordion.Header>{item.question}</Accordion.Header>
                        <Accordion.Body>{item.answer}</Accordion.Body>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    );
}


const Wrapper = styled.div`
    padding: 20px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 20px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 20px ${({ theme }) => theme.sm_padding};
    }
`

const Flexbox = styled.div`
    width: 100%;
    margin: 20px auto 10px auto;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .left {
        width: calc(100% - 400px - 50px);
        padding: 10px;
    }
    .right {
        width: 400px;
        border: 1px solid var(--yellow);
        border-radius: 2px;
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

    form {
        width: 100%;
        padding: 10px;
        margin: auto;
        max-width: 800px;
        display: block;

        textarea {
            min-height: 20vh;
        }

        input, textarea {
            width: 100%;
            border: 1px solid #ccc;
            display: block;
            margin-bottom: 10px;
            padding: 10px;

            &:focus {
                outline: none;
                border: 3px solid var(--blue);
            }
        }
    }
`