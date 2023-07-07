import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import apiClass from '../../../utils/api'
import Spinner_ from '../../spinner/Spinner';
import Modal from '../../Modal';
import Btn from '../../Btn/Btn';
import { Context } from '../../../context/Context';
import MarkdownContent from '../../MarkdownContent';
import InfoIcon from '@mui/icons-material/Info';

const api = new apiClass()

export default function SendNotifications() {
    const { user, notifications } = useContext(Context)
    const [showModal, setShowModal] = useState(false)
    const [inp, setInp] = useState({
        subject: '',
        text: ''
    });

    const {
        sendingNotificatio_admin,
        setSendingNotificatio_admin,
    } = notifications;


    const {
        setProfileLoadingAgain,
        setProfileData,
    } = user.profile;

    const submitForm = (e) => {
        e.preventDefault();
        setSendingNotificatio_admin(true);

        // if accesstoken not there, refresh it before send data, otherwise, send data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.pushNotification_admin(inp, setSendingNotificatio_admin, setInp, setProfileData, setProfileLoadingAgain)
            }, 2000);
        }
        else {
            api.pushNotification_admin(inp, setSendingNotificatio_admin, setInp, setProfileData, setProfileLoadingAgain)
        }
    }

    return (
        <Wrapper>
            <div className="actions">
                <div onClick={() => { setShowModal(true) }} className="add-plan">Preview</div>
                <div onClick={() => { window.open("https://www.markdownguide.org/cheat-sheet/", '_blank') }} className="help"> < InfoIcon /> </div>
            </div>
            <Modal
                title="Preview"
                show={showModal}
                onHide={setShowModal}
            >
                <MarkdownContent text={inp.text} />
            </Modal>

            <h4 className='header'>Send Notification</h4>
            <form onSubmit={submitForm}>
                <input
                    placeholder='Enter Subject'
                    value={inp.subject || ''}
                    onChange={(e) => setInp({ ...inp, subject: e.target.value })}
                />
                <textarea
                    className='textarea'
                    placeholder='Enter markdown text'
                    value={inp.text || ''}
                    onChange={(e) => setInp({ ...inp, text: e.target.value })}
                />

                <div className='text-center text-md-start mt- pt-2'>
                    <Btn disabled={sendingNotificatio_admin} color="var(--blue)" link={false}>
                        {sendingNotificatio_admin ? <Spinner_ size="sm" /> : "Send"}
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
            min-height: 50vh;
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

    .actions {
        position: absolute;
        top: 13px;
        right: 55px;
        text-align: center;
        border-radius: 15px;
        z-index: 1000;
        width: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .help {
            cursor: pointer;
            font-size: .8rem;
            color: rgb(0 123 255 / 43%);
            transition: ${({ theme }) => theme.transition};
            text-align: center;
            border-radius: 50%;

            &:hover {
                color: var(--blue);
            }
        }

        .add-plan {
            cursor: pointer;
            padding: 1px 8px;
            font-size: .8rem;
            color: #fff;
            background: rgb(0 123 255 / 43%);
            border: 1px solid rgb(0 123 255 / 43%);
            transition: ${({ theme }) => theme.transition};
            text-align: center;
            border-radius: 15px;

            &:hover {
                background: rgb(255 255 255 / 43%);
                border: 1px solid rgb(0 123 255 / 43%);
                color: var(--blue);
            }
        }
    }

    .tag {
        font-size: .65rem;
        color: red;
    }
`