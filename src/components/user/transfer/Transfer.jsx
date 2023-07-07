import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../../../context/Context';
import Spinner_ from '../../spinner/Spinner';
import apiClass from '../../../utils/api';
import Skeleton from '../../Skeleton';
import Cookies from 'js-cookie'
import Btn from '../../Btn/Btn';
import Modal from '../../Modal';

const api = new apiClass()


export default function Transfer() {

    const { user, config } = useContext(Context);
    const { configData } = config
    const {
        profileLoadingAgain,
        setProfileLoadingAgain,
        setProfileData,
    } = user.profile;

    const {
        verifyAccountNoLoading,
        setVerifyAccountNoLoading,
        payLoading,
        setPayLoading,
        verifyAccountNoData,
        setVerifyAccountNoData,
        showPayUserModal,
        setShowPayUserModal,
        transferSuccess,
        setTransferSuccess
    } = user.transfer

    const [loading, setLoading] = useState(true);

    const initiastate = {
        accountNumber: null,
        amount: null,
    }

    const [inp, setInp] = useState(initiastate);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    // submit data
    const verify = (e) => {
        e.preventDefault()
        setVerifyAccountNoLoading(true)

        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.verifyAccountNo(inp, setVerifyAccountNoLoading, setVerifyAccountNoData, setShowPayUserModal)
            }, 2000);
        }
        else {
            api.verifyAccountNo(inp, setVerifyAccountNoLoading, setVerifyAccountNoData, setShowPayUserModal)
        }
    }

    const handlePayUser = (e) => {
        e.preventDefault()
        setPayLoading(true)

        // if accesstoken not there, refresh it before proceeding, otherwise, proceed straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.payUser(inp, setPayLoading, setTransferSuccess, setProfileLoadingAgain, setProfileData)
            }, 2000);
        }
        else {
            api.payUser(inp, setPayLoading, setTransferSuccess, setProfileLoadingAgain, setProfileData)
        }
    }

    useEffect(() => {
        if (transferSuccess) {
            setInp(initiastate)

            // close the modal
            setShowPayUserModal(false)
        }

    }, [transferSuccess])

    useEffect(() => {
        if (transferSuccess) {
            setInp(initiastate)

            // close the modal
            setShowPayUserModal(false)
        }

    }, [])

    const Note = () => {
        return configData.transferableFactors?.length === 1 && configData.transferableFactors[0] === 1 ?
            <div style={{ fontSize: '.7rem', marginBottom: '20px' }}>Any amout can be transfered</div> :
            <div style={{ fontSize: '.7rem', marginBottom: '20px' }}>
                <div>
                    Min Transferrable Amount:
                    {" "}<span style={{ color: 'var(--blue-deep)' }}>{configData.minTransferableLimit} {configData.curreny}</span>
                </div>
                <div>
                    Transferrable Common Diff:
                    {" "}<span style={{ color: 'var(--blue-deep)' }}>{configData.transferableCommonDiff}  {configData.curreny}</span>
                </div>
                <div>
                    Max Transferrable Amount:
                    {" "}<span style={{ color: 'var(--blue-deep)' }}>{configData.maxTransferableLimit} {configData.curreny}</span>
                </div>
            </div>
    }

    // remove the inp.amount when modal is closed
    useEffect(() => {
        if (!showPayUserModal) {
            setInp({ ...inp, amount: null })
        }
    }, [showPayUserModal])


    return (
        <Wrapper>
            {
                loading || !configData ?
                    <>
                        <SubWrapper>
                            <div className="amount">
                                <Skeleton />
                            </div>
                        </SubWrapper>
                    </>
                    :
                    <SubWrapper>
                        <form onSubmit={verify} action="">
                            <Note />
                            <label htmlFor="">Enter Acccount Number</label>
                            <InputWrapper>
                                <input
                                    type="number"
                                    autoFocus
                                    placeholder='Enter Account Number'
                                    value={inp.accountNumber || ''}
                                    onChange={(e) => setInp({ ...inp, accountNumber: e.target.value })}
                                />
                            </InputWrapper>

                            <div className='text-center text-md-start mt- pt-2'>

                                <Btn disabled={!inp.accountNumber} color="var(--blue)" link={false}>
                                    {verifyAccountNoLoading || showPayUserModal ? <Spinner_ size="sm" /> : "Verify Account"}
                                </Btn>
                            </div>

                        </form>
                    </SubWrapper>
            }

            <Modal
                title="Transfer"
                show={showPayUserModal}
                onHide={setShowPayUserModal}
            >
                <form onSubmit={handlePayUser} action="">
                    <Note />
                    <div>
                        Receiver: <span style={{ fontWeight: 600 }}>{verifyAccountNoData.username} </span>
                    </div>
                    <InputWrapper>
                        <input
                            type="number"
                            autoFocus
                            placeholder='Enter Amount'
                            value={inp.amount || ''}
                            onChange={(e) => setInp({ ...inp, amount: e.target.value })}
                        />
                    </InputWrapper>

                    <div className='text-center text-md-start mt- pt-2'>

                        <Btn disabled={!inp.accountNumber} color="var(--blue)" link={false}>
                            {payLoading || profileLoadingAgain ? <Spinner_ size="sm" /> : "Proceed"}
                        </Btn>
                    </div>

                </form>
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
    }
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px 10px;
    width: 100%;
    margin: auto;
    box-shadow: 2px 2px 5px #ccc;

    .amount {
        display: inline-block;
        padding: 2px 0;
        min-width: 120px;
        height: 30px;
        margin-bottom: 20px;
    }
`


const InputWrapper = styled.div`
    width: 100%;
    height: 45px;
    margin-bottom: 20px;
    position: relative;


    input {
        border: 1px solid #ccc;
        padding: 12px 30px 12px 30px;
        height: 100%;
        width: 100%;
        display: block;
        border-radius: 8px;
        font-size: .9rem;

        &: focus{
            outline: none;
            border: 2px solid var(--blue);
        }
    }
`