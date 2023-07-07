import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";
import Btn from '../../Btn/Btn';
import { Table } from '../../../styles/globalStyles';
import { Context } from '../../../context/Context';
import apiClass from '../../../utils/api';
import Spinner_ from '../../spinner/Spinner';
import Modal from '../../Modal';
import { Link } from 'react-router-dom';

const api = new apiClass()

export default function DepositData() {
    const { snap } = useSnap(.5)
    const { config, admin, num } = useContext(Context);
    const [inp, setInp] = useState('')
    const [amount, setAmount] = useState(null)

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);

    const [selectedData, setSelectedData] = useState('');

    const {
        resolvingDeposit,
        setResolvingDeposit,
        setFetchingDepositData_refresh,
        setDepositData,
        showResolvingDepositModal,
        setShowResolvingDepositModal,
        depositData,
    } = admin.deposit

    const [filteredData, setFilter] = useState(depositData);

    useEffect(() => {
        const newData = filter({
            data: depositData,
            keys: ["username", "status", , "_id", 'code', "amountExpected", "amountReceived", "link", "comment"],
            input: inp
        })

        setFilter(newData)

    }, [inp, depositData])

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
        setShowResolvingDepositModal(true)
    }

    const resolveDeposit = (e) => {
        e.preventDefault();
        setResolvingDeposit(true);

        // if accesstoken not there, refresh it before proceeding data, otherwise, get data straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.resolveDepositAdmin(
                    amount,
                    selectedData._id,
                    setResolvingDeposit,
                    setFetchingDepositData_refresh,
                    setDepositData,
                    setAmount,
                    setShowResolvingDepositModal,
                    setSelectedData,
                    '',
                    '',
                    '',
                    '',
                )
            }, 2000);
        }
        else {
            api.resolveDepositAdmin(
                amount,
                selectedData._id,
                setResolvingDeposit,
                setFetchingDepositData_refresh,
                setDepositData,
                setAmount,
                setShowResolvingDepositModal,
                setSelectedData,
                '',
                '',
                '',
                '',
            )
        }
    }


    return (
        <Wrapper>
            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total: {depositData?.length}</div>
                    </div>

                    <div className="stat">
                        <div>Initiated: {(depositData?.filter(depositData => depositData.status?.toLowerCase() === 'charge-created')).length}</div>
                    </div>

                    <div className="stat">
                        <div>Confirmed: {(depositData?.filter(depositData => depositData.status?.toLowerCase() === 'charge-confirmed')).length}</div>
                    </div>

                    <div className="stat">
                        <div>Failed/Canceled: {(depositData?.filter(depositData => depositData.status?.toLowerCase() === 'charge-failed')).length}</div>
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
                            <th>Code</th>
                            <th>Track</th>
                            <th>Resolve</th>
                            <th>Status</th>
                            <th>Comment</th>
                            <th>Id</th>
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
                                    <td>{data.amountExpected}</td>
                                    <td>{data.code}</td>

                                    <td style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => window.open(data.link)}><Link>Link</Link></td>
                                    <td
                                        style={{
                                            cursor: data.status === 'charge-confirmed' ? 'default' : 'pointer',
                                            userSelect: 'none',
                                            color: 'var(--blue)'
                                        }}
                                        onDoubleClick={() => data.status === 'charge-confirmed' ? () => { } : resolve(data)}
                                    >
                                        {
                                            data.status === 'charge-confirmed' ? "" : 'Resolve'
                                        }
                                    </td>
                                    <td style={
                                        (function () {
                                            if (data.status === 'charge-created') {
                                                return { color: 'var(inherit' }
                                            }
                                            else if (data.status === 'charge-confirmed') {
                                                return { color: 'var(--blue' }
                                            }
                                            else if (data.status === 'charge-pending') {
                                                return { color: 'var(--yellow' }
                                            }
                                            else {
                                                return { color: 'red' }
                                            }
                                        }())
                                    }>{data.status}</td>
                                    <td>{data.comment}</td>
                                    <td>{data._id}</td>
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
                show={showResolvingDepositModal}
                onHide={setShowResolvingDepositModal}
                title={`Resolving Deposit`}
            >
                <form onSubmit={resolveDeposit} action="">
                    <div style={{ marginBottom: '20px' }}>
                        <div><span style={{ fontWeight: 'bold' }}>Username:</span> {selectedData.userId?.username}</div>
                        <div><span style={{ fontWeight: 'bold' }}>Link:</span><a href={selectedData.link}> {selectedData.link}</a></div>
                        <div><span style={{ fontWeight: 'bold' }}>Transaction Code:</span> {selectedData.code}</div>
                        <div><span style={{ fontWeight: 'bold' }}>Status:</span> {selectedData.status}</div>
                    </div>

                    <label htmlFor="">Amount</label>
                    <InputWrapper>
                        <input
                            type="number"
                            autoFocus
                            placeholder='Enter Amount in USD'
                            value={amount || ''}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </InputWrapper>

                    <div className='text-center text-md-start mt- pt-2'>

                        <Btn
                            disabled={!amount || resolvingDeposit}
                            color="var(--blue)"
                            link={false}
                        >
                            {resolvingDeposit ? <Spinner_ size="sm" /> : "Proceed"}
                        </Btn>
                    </div>
                </form>
            </Modal>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;

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
