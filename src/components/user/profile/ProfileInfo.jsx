import React, { useContext } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Spinner_ from '../../spinner/Spinner';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ChangeProfileImage from '../../../components/user/ChangeProfileImage';
import Copy from '../../CopyToClipboard';
import ShareLink from '../../ShareLink';

export default function ProfileInfo() {
    const { user } = useContext(Context);
    const { profileData, } = user.profile;

    const { profileImageLoading } = user.profileImage;

    return (
        <Wrapper>
            <div className="img">
                {
                    profileImageLoading ? <div className="changeProfile center"><Spinner_ size="sm" /></div> :
                        <label htmlFor='file' className="changeProfile">
                            <AddAPhotoIcon style={{ fontSize: '2rem', color: '#000' }} />
                        </label>
                }
                <ChangeProfileImage />
                <img src={profileData?.profilePicUrl} alt="profile image" />
            </div>

            <div className="user">
                <span style={{ fontWeight: 'bold' }}>
                    {profileData.username}
                    <span style={
                        (function () {
                            if (profileData.role == 'AMDIN' && !profileData.isSupperAdmin) {
                                return { color: 'var(--blue)' }
                            }
                            if (profileData.role == 'ADMIN' && profileData.isSupperAdmin) {
                                return { color: 'red' }
                            }
                            else {
                                return { color: 'inherit' }
                            }
                        }())
                    }> {profileData.isSupperAdmin ? `(SUPPER ADMIN)` : `(${profileData.role})`}
                    </span>
                </span>
            </div>


            <div className="user">
                <span style={{ fontWeight: 'bold' }}>{profileData.email}</span>
            </div>

            <div className="user">
                <span className="name">Acct Bal: </span>
                <span style={{ color: 'red' }} className="value">{profileData.amount} {profileData.currency}</span>
            </div>

            <div className="user">
                <span className="name">Referral Contest Rewards: </span>
                <span style={{ color: 'red' }} className="value">{profileData.referralContestRewards} {profileData.currency}</span>
            </div>

            <div className="user">
                <span className="name">Acct No: </span>
                <span style={{ color: 'red' }} className="value">
                    <Copy copyText={profileData.accountNumber}>{profileData.accountNumber}</Copy>
                </span>
            </div>

            <div className="user">
                <span className="name">Referral Code: </span>
                <span style={{ color: 'red' }} className="value">
                    <Copy copyText={profileData.referralCode}>{profileData.referralCode}</Copy>
                </span>
                <span style={{ marginLeft: '20px' }}>
                    <ShareLink refcode={profileData.referralCode} />
                </span>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    .user {
        margin-bottom: 10px;
        .name {
            font-weight: bold;
        }
    }

    .img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid #ccc;
        object-fit: contain;
        position: relative;
        margin-bottom: 20px;

        .changeProfile {
            position: absolute;
            right: 10px;
            bottom: 0;
            cursor: pointer;
        }

        @media (max-width: ${({ theme }) => theme.sm_screen}){
            margin: auto;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
`