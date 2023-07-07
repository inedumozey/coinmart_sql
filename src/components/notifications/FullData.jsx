import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import MarkdownContent from '../MarkdownContent';
import { useSnap } from '@mozeyinedu/hooks-lab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import apiClass from '../../utils/api';
import Spinner_ from '../spinner/Spinner';
import { Context } from '../../context/Context';

const api = new apiClass()

export default function FullData({ data }) {
    const { snap } = useSnap(.5)
    const [showDropDown, setShowDropDown] = useState(false);
    const { notifications, user } = useContext(Context);
    const navigate = useNavigate()

    const { setDeletetingNotification, deletetingNotification } = notifications;

    const {
        setProfileData,
        setProfileLoadingAgain
    } = user.profile;


    const handleDelete = (id) => {
        setDeletetingNotification(true);

        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.deleteeNotification_user(id, setDeletetingNotification, setProfileData, setProfileLoadingAgain, navigate)
            }, 2000);
        }
        else {
            setTimeout(() => {
                api.deleteeNotification_user(id, setDeletetingNotification, setProfileData, setProfileLoadingAgain, navigate)
            }, 1000);
        }
    }


    return (
        <SubWrapper showDropDown={showDropDown}>
            {
                !Cookies.get('extratoken') && Cookies.get('refreshtoken') ?

                    <>
                        <div
                            className="action"
                            {...snap()}
                            onClick={() => setShowDropDown(!showDropDown)}
                        >
                            <MoreVertIcon />
                        </div>

                        <div
                            className="dropdown"
                            {...snap()}
                            onClick={!deletetingNotification ? () => handleDelete(data._id) : () => { }}
                        >
                            {
                                deletetingNotification ? <Spinner_ size="sm" /> : "Delete"
                            }
                        </div>
                    </> : ''
            }

            <MarkdownContent text={data.text} />
            <div style={{ color: 'var(--yellow', textAlign: 'right', fontSize: '.7rem' }} className="date">{data.createdAt && new Date(data.createdAt).toLocaleString()}</div>
        </SubWrapper>
    )
}

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px;
    width: 100%;
    margin: 10px auto;
    box-shadow: 2px 2px 5px #ccc;
    position: relative;

    .action {
        position: absolute;
        user-select: none;
        right: 0;
        top: 0;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items:center;
        cursor: pointer;

        &:hover {
            border: 1px solid  #ccc;
        }
    }

    .dropdown {
        position: absolute;
        user-select: none;
        background: #fff;
        right: 0;
        top: 30px;
        width: 120px;
        display: flex;
        justify-content: center;
        align-items:center;
        cursor: pointer;
        color: red;
        display: ${({ showDropDown }) => !showDropDown ? 'none' : 'flex'};
        height: 40px;
        box-shadow: 2px 2px 5px #ccc;
        z-index: 2;

        &:hover {
            opacity: .8
        }
    }

`