import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context';
import Spinner_ from '../../../spinner/Spinner';
import apiClass from '../../../../utils/api';
import Cookies from 'js-cookie'
import Btn from '../../../Btn/Btn';
import Modal from '../../../Modal';
import Select from 'react-select'

const api = new apiClass()


export default function Actions({ selectedUser }) {
    const { admin } = useContext(Context);

    const initialState = {
        amount: null,
        action: ""
    }
    const [inp, setInp] = useState(initialState)

    const {
        userData_admin,
        setUserData_admin,
        fetchingUserData_admin_refesh,
        setFetchingUserData_admin_refesh,
    } = admin.userHistory

    const {
        openCreditUserModal,
        showOpenCreditUserModal,
        creditingUser,
        setCreditingUser,
    } = admin.creditUser

    const openModal_CreditUser = () => {
        console.log(selectedUser);

        showOpenCreditUserModal(true);
    }

    const handleCreditUser = (e) => {
        e.preventDefault()
        setCreditingUser(true)
        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.creaditUser(
                    inp,
                    selectedUser,
                    setCreditingUser,
                    showOpenCreditUserModal,
                    setUserData_admin,
                    setFetchingUserData_admin_refesh,
                    setInp
                )
            }, 2000);
        }
        else {
            api.creaditUser(
                inp,
                selectedUser,
                setCreditingUser,
                showOpenCreditUserModal,
                setUserData_admin,
                setFetchingUserData_admin_refesh,
                setInp
            )
        }
    }

    return (
        <Wrapper>
            <div className="action-btn">
                <Btn
                    link={false}
                    disabled={creditingUser}
                    onClick={openModal_CreditUser}
                    color="var(--blue)"
                >
                    {creditingUser ? <Spinner_ size="sm" /> : "Credit User"}
                </Btn>
            </div>

            {/* credit user modal */}
            <Modal
                title={`Crediting ${userData_admin?.profile?.username}`}
                show={openCreditUserModal}
                onHide={showOpenCreditUserModal}
            >
                <form onSubmit={handleCreditUser}>
                    <div style={{ fontWeight: 'bold' }}>
                        Currrent Balance: {userData_admin?.profile?.amount} {userData_admin?.profile?.currency}
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <InputWrapper>
                            <label>Enter Amount</label>
                            <input
                                autoFocus
                                type="number"
                                value={inp.amount || ''}
                                placeholder="Enter amount"
                                onChange={(e) => setInp({ ...inp, amount: e.target.value })}
                            />
                        </InputWrapper>

                        <InputWrapper>
                            <label>Select Action</label>
                            <Select
                                options={[
                                    { value: 'add', label: 'Add' },
                                    { value: 'remove', label: 'Remove' }
                                ]}
                                onChange={(selectedOption) => setInp({ ...inp, action: selectedOption.value })}
                            />
                        </InputWrapper>


                        <div className='center'>
                            <Btn disabled={creditingUser || fetchingUserData_admin_refesh || !inp.amount || !inp.action} color="var(--blue)" link={false}>
                                {creditingUser || fetchingUserData_admin_refesh ? <Spinner_ size="sm" /> : "Start"}
                            </Btn>
                        </div>
                    </div>
                </form>
            </Modal>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .action-btn {
        margin: 5px;
    }
`


const InputWrapper = styled.div`
    width: 100%;
    min-height: 45px;
    margin-bottom: 15px;    
    font-size: .8rem;

    .tag {
        color: #c30;
        font-size: .7rem;
    }
    
    input {
        padding: 10px 12px;
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
        display: block;
        font-size: .9rem;
        border-radius: 5px;

        &: focus{
            outline: none;
            border: 3px solid var(--blue);
        }
    } 
`