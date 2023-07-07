import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import Spinner_ from '../../../spinner/Spinner'
import { Context } from '../../../../context/Context'
import apiClass from '../../../../utils/api'
import { Table } from '../../../../styles/globalStyles'
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";
import Modal from '../../../Modal'
import Btn from '../../../Btn/Btn'

const api = new apiClass()

export default function WithdrawalHxData({ data, selectedUser }) {
    const { snap } = useSnap(.5)
    const { config, admin, num } = useContext(Context);
    const [inp, setInp] = useState('')

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);

    const [selectedData, setSelectedData] = useState('');

    const {
        fetchingPendingWithdrawalData_refresh,
        setFetchingPendingWithdrawalData_refresh,
        setPendingWithdrawalData,
        showPendingWithdrawalModal,
        setShowPendingWithdrawalModal,

        rejectingWithdrawal,
        setRejectingWithdrawal,
        setRejectingWithdrawalSuccess,

        confirmingWithdrawal,
        setConfirmingWithdrawal,
        setConfirmingWithdrawalSuccess,
    } = admin.withdrawal


    const {
        setUserData_admin,
        setFetchingUserData_admin_refesh,
    } = admin.userHistory;

    const [filteredData, setFilter] = useState(data);

    useEffect(() => {
        const newData = filter({
            data: data,
            keys: ["username", "email", 'walletAddress', "amount", "coin", "status", "_id"],
            input: inp
        })

        setFilter(newData)

    }, [inp, data])

    const handleViewMore = () => {
        setOpening(true)

        setTimeout(() => {
            setOpening(false)
            setCount(prevState => prevState + num)
        }, 1000)
    }


    // open withdrawal modal
    const resolve = (data) => {
        setSelectedData(data);
        setShowPendingWithdrawalModal(true)
    }

    const handleRejectWithdrawal = (data) => {
        setSelectedData(data);
        setRejectingWithdrawal(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.rejectWithdrawal(
                    data._id,
                    setRejectingWithdrawal,
                    setRejectingWithdrawalSuccess,
                    setFetchingPendingWithdrawalData_refresh,
                    setPendingWithdrawalData,
                    setShowPendingWithdrawalModal,
                    setSelectedData,
                    'hx',
                    selectedUser,
                    setUserData_admin,
                    setFetchingUserData_admin_refesh,
                )
            }, 2000);
        }
        else {
            api.rejectWithdrawal(
                data._id,
                setRejectingWithdrawal,
                setRejectingWithdrawalSuccess,
                setFetchingPendingWithdrawalData_refresh,
                setPendingWithdrawalData,
                setShowPendingWithdrawalModal,
                setSelectedData,
                'hx',
                selectedUser,
                setUserData_admin,
                setFetchingUserData_admin_refesh,
            )
        }
    }

    const handleConfirmWithdrawal = (data) => {
        setSelectedData(data);
        setConfirmingWithdrawal(true)

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.confirmWithdrawal(
                    data._id,
                    setConfirmingWithdrawal,
                    setConfirmingWithdrawalSuccess,
                    setFetchingPendingWithdrawalData_refresh,
                    setPendingWithdrawalData,
                    setShowPendingWithdrawalModal,
                    setSelectedData,
                    'hx',
                    selectedUser,
                    setUserData_admin,
                    setFetchingUserData_admin_refesh,
                )
            }, 2000);
        }
        else {
            api.confirmWithdrawal(
                data._id,
                setConfirmingWithdrawal,
                setConfirmingWithdrawalSuccess,
                setFetchingPendingWithdrawalData_refresh,
                setPendingWithdrawalData,
                setShowPendingWithdrawalModal,
                setSelectedData,
                'hx',
                selectedUser,
                setUserData_admin,
                setFetchingUserData_admin_refesh,
            )
        }
    }


    return (
        <Wrapper>
            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total: {data?.length}</div>
                    </div>
                    <div className="stat">
                        <div>Pending:  {(data?.filter(data => data.status?.toLowerCase() === 'pending')).length}</div>
                    </div>

                    <div className="stat">
                        <div>Confirmed: {(data?.filter(data => data.status?.toLowerCase() === 'confirmed')).length}</div>
                    </div>

                    <div className="stat">
                        <div>Rejected: {(data?.filter(data => data.status?.toLowerCase() === 'rejected')).length}</div>
                    </div>
                </div>
                <div className="search-wrapper">
                    <div className="search">
                        <input
                            placeholder='Search by Username, Email, Amount, Coin or Wallet Address'
                            value={inp || ''}
                            onChange={(e) => setInp(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <Table>
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Date</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Amount {`(${config.configData.currency})`}</th>
                            <th>Wallet</th>
                            <th>coin</th>
                            <th>Status</th>
                            <th>Resolve</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.slice(0, count).map((data, i) => {
                            return (
                                <tr key={data._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {data.createdAt && new Date(data.createdAt).toLocaleString()}
                                    </td>
                                    <td>{data.userId?.email}</td>
                                    <td>{data.userId?.username}</td>
                                    <td>{data.amount}</td>
                                    <td>{data.walletAddress}</td>
                                    <td>{data.coin}</td>
                                    <td>{data.status}</td>
                                    {
                                        data.status?.toLowerCase() === 'pending' ?
                                            <td
                                                {...snap()}
                                                onDoubleClick={() => resolve(data)}
                                                style={{ color: 'red', userSelect: 'none' }}
                                            >
                                                Resolve
                                            </td> : <td></td>
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Table>
            {
                count >= filteredData.length ? '' :

                    <ViewMore>

                        <div onClick={handleViewMore} className="more" {...snap()}>
                            {opening ? <div className='center'> <Spinner_ size="sm" /></div> : 'View more...'}
                        </div>
                    </ViewMore>
            }

            <Modal
                show={showPendingWithdrawalModal}
                onHide={setShowPendingWithdrawalModal}
                title="Resolving Pending Withdrawal"
            >
                <Resolve>
                    <div><span style={{ fontWeight: "bold" }}>Username:</span> {selectedData.userId?.username}</div>
                    <div><span style={{ fontWeight: "bold" }}>Amount:</span> {selectedData.amount} {config.configData.currency}</div>
                    <div><span style={{ fontWeight: "bold" }}>Wallet:</span> {selectedData.walletAddress}</div>
                    <div><span style={{ fontWeight: "bold" }}>Coin:</span> {selectedData.coin}</div>
                    <div><span style={{ fontWeight: "bold" }}>Date:</span> {selectedData.createdAt && new Date(selectedData.createdAt).toLocaleString()}</div>

                    <div className="actions">
                        <div className="reject">
                            <Btn
                                onClick={() => handleRejectWithdrawal(selectedData)}
                                disabled={rejectingWithdrawal || fetchingPendingWithdrawalData_refresh}
                                color="var(--blue)" link={false}
                            >
                                {
                                    rejectingWithdrawal ? <Spinner_ size="sm" /> : "Reject"
                                }
                            </Btn>
                        </div>

                        <div className="confirm">
                            <Btn
                                onClick={() => handleConfirmWithdrawal(selectedData)}
                                disabled={confirmingWithdrawal || fetchingPendingWithdrawalData_refresh}
                                color="var(--blue)" link={false}
                            >
                                {
                                    confirmingWithdrawal ? <Spinner_ size="sm" /> : "Confirm"
                                }
                            </Btn>
                        </div>
                    </div>
                </Resolve>
            </Modal>
        </Wrapper>
    )
}


const Wrapper = styled.div`

    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            display: inline-block;
            margin-bottom: 10px;
            width: 40%;
            max-width: 300px;
            min-width: 200px;
    
            input {
                padding: 6px;
                border-radius: 5px;
                width: 100%;
                border: 1px solid #ccc;
        
                &: focus {
                    outline: none;
                }
            }
        }
    }

`

const ViewMore = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;

    .more{
        user-select: none;
       
        -webkit-user-select: none;
        font-size: .7rem;
        cursor: pointer;
        border: 1px solid;
        border-radius: 5px;
        padding: 7px;

        &:hover{
            opacity: .3
        }
    }
`

const Resolve = styled.div`
    padding: 10px;
    font-size: .8rem;

    .actions {
        margin-top: 15px;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: centerl;
    }
`