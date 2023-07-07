import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { Context } from '../../../context/Context'
import apiClass from '../../../utils/api'
import HistoryData from './HistoryData'
import Btn from '../../Btn/Btn'
import Modal from '../../Modal'
import Copy from '../../CopyToClipboard'
import AddRefcode from './AddReferrer';
import ShareLink from '../../ShareLink'

const api = new apiClass()

export default function History() {
    const { user, config, fetchDataErrorMsg } = useContext(Context);

    const {
        fetchReferralHxLoading,
        setFetchReferralHxLoading,
        referralHxData,
        setReferralHxData,
        fetchReferralHxSuccess,
        setFetchReferralHxSuccess,
        showAddRefcodeModal,
        setShowAddRefcodeModal,
    } = user.referral

    const {
        profileLoading,
        profileData,
        setFetchProfileSuccess,
    } = user.profile


    const [load, setLoading] = useState(true)

    useEffect(() => {
        setFetchReferralHxLoading(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.fetchReferralHx(setFetchReferralHxLoading, setReferralHxData, setFetchReferralHxSuccess)
            }, 2000);
        }
        else {
            api.fetchReferralHx(setFetchReferralHxLoading, setReferralHxData, setFetchReferralHxSuccess)
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <Wrapper>

            <SubWrapper>
                {
                    profileLoading || load ?
                        <Skeletons>
                            loading...
                        </Skeletons> :
                        !setFetchProfileSuccess ? <div className="tag">{fetchDataErrorMsg}</div> :
                            <>
                                <div>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>Your Referral Code:</span> {" "}
                                        <span><Copy copyText={profileData.referralCode}>{profileData.referralCode}</Copy></span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <ShareLink refcode={profileData.referralCode} />
                                        </span>
                                        <span>

                                        </span>
                                    </div>

                                </div>
                                <br />
                                <div>
                                    <div style={{ fontWeight: "bold" }}>Invite your Friends now to claim Commision from their first Investment</div>
                                    <div>Earn {config.configData.referralBonusPercentage}% Referral Commission from each of your downlines for their first {config.configData.referralBonusLimit} investment{"(s)"}</div>
                                </div>
                                <br />
                                {
                                    profileData.referrerUsername ?
                                        <div>
                                            You were referred by <span style={{ fontWeight: 'bold' }}>{profileData.referrerUsername}</span>
                                        </div> :

                                        <div className='text-center text-md-start mt- pt-2'>

                                            <Btn onClick={() => setShowAddRefcodeModal(true)} color="var(--blue)" link={false}>
                                                Add Referral
                                            </Btn>
                                        </div>
                                }
                            </>
                }
            </SubWrapper>


            <SubWrapper>
                {
                    fetchReferralHxLoading || load ?
                        <Skeletons>
                            loading...
                        </Skeletons> :
                        !fetchReferralHxSuccess ? <div className="tag">{fetchDataErrorMsg}</div> :
                            referralHxData.length < 1 ? <div className="tag">Refer users to enjoy the referral bonus packages</div> :
                                <>
                                    <div className="tag">You have <span style={{ color: 'red' }}>{`(${referralHxData.length})`}</span> downlines</div>
                                    <HistoryData />
                                </>
                }
            </SubWrapper>

            <Modal
                title="Add Referral Code"
                show={showAddRefcodeModal}
                onHide={setShowAddRefcodeModal}
            >
                <AddRefcode />
            </Modal>

        </Wrapper>
    )
}


const Wrapper = styled.div`
width: 100vw;
margin: auto;
max-width: 800px;
min-height: 70vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

padding: 10px ${({ theme }) => theme.lg_padding};
@media (max-width: ${({ theme }) => theme.md_screen}){
    padding: 10px ${({ theme }) => theme.md_padding};
}
@media (max-width: ${({ theme }) => theme.sm_screen}){
    padding: 10px ${({ theme }) => theme.sm_padding};
}

.tag { 
    font-weight: bold;
    margin-bottom: 20px;
}
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px 10px;
    width: 100%;
    margin: 10px auto 40px auto;
    box-shadow: 2px 2px 5px #ccc;
`

const Skeletons = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
   
`