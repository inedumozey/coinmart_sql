import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import apiClass from '../../../utils/api'
import Spinner_ from '../../spinner/Spinner';
import Btn from '../../Btn/Btn';
import { Context } from '../../../context/Context';

const api = new apiClass()

export default function SendNotifications() {
    const { user } = useContext(Context)
    const [inp, setInp] = useState({
        subject: '',
        message: ''
    });

    const {
        sendingMsg,
        setSendingMsg,
    } = user.contactUs;


    const submitForm = (e) => {
        e.preventDefault();
        setSendingMsg(true);

        // if accesstoken not there, refresh it before send data, otherwise, send data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.contactAdmin(inp, setSendingMsg, setInp)
            }, 2000);
        }
        else {
            api.contactAdmin(inp, setSendingMsg, setInp)
        }
    }

    return (
        <Wrapper>
            <h4 className='header'>Contact us</h4>
            <form onSubmit={submitForm}>
                <input
                    placeholder='Enter Subject'
                    value={inp.subject || ''}
                    onChange={(e) => setInp({ ...inp, subject: e.target.value })}
                />
                <textarea
                    className='textarea'
                    placeholder='Enter markdown text'
                    value={inp.message || ''}
                    onChange={(e) => setInp({ ...inp, message: e.target.value })}
                />

                <div className='text-center text-md-start mt- pt-2'>
                    <Btn disabled={sendingMsg} color="var(--blue)" link={false}>
                        {sendingMsg ? <Spinner_ size="sm" /> : "Send"}
                    </Btn>
                </div>
            </form>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px ${({ theme }) => theme.lg_padding};
        @media (max-width: ${({ theme }) => theme.md_screen}){
            padding: 20px ${({ theme }) => theme.md_padding};
        }
        @media (max-width: ${({ theme }) => theme.sm_screen}){
            padding: 20px ${({ theme }) => theme.sm_padding};
            grid-template-columns: repeat( auto-fit, minmax(170px, 1fr) );
        }
    }

    .header {
        border-bottom: 1px solid #ccc;
        width: 100%;
    }

    form {
        width: 100%;
        padding: 10px;
        margin: auto;
        max-width: 800px;
        display: block;

        textarea {
            min-height: 40vh;
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

    .tag {
        font-size: .65rem;
        color: red;
    }
`