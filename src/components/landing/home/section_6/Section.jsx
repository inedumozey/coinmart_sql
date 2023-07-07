import styled from 'styled-components';
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../../context/Context';
import { Table } from '../../../../styles/globalStyles';
import Skeleton from '../../../Skeleton';

const count = 10;

export default function Section() {
    const {
        home_page_section6_title,
        home_page_section6_body,
        home_page_section6_deposit,
        home_page_section6_withdrawal,
        config,
        latestData,
        fetchDataErrorMsg
    } = useContext(Context);

    const {
        fetchLatestWithdrawal,
        fetchLatestWithdrawalSuccess,
        latestWithdrawalData,

        fetchLatestDeposit,
        fetchLatestDepositSuccess,
        latestDepositData,
    } = latestData


    const [load, setLoading] = useState(true)
    const [deposit, setDeposit] = useState([])
    const [withdrawal, setWithdrawal] = useState([])

    useEffect(() => {
        latestDepositData.length < count ? setDeposit(home_page_section6_deposit) : setDeposit(latestDepositData)

        latestWithdrawalData.length < count ? setWithdrawal(home_page_section6_withdrawal) : setWithdrawal(latestWithdrawalData)
    }, [latestWithdrawalData, latestDepositData]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);

    return (
        <Wrapper>
            <h3 style={{ textAlign: 'center' }}>{home_page_section6_title}</h3>
            <div style={{ textAlign: 'center' }}>{home_page_section6_body}</div>
            <div className='table'>
                <div className='table-wrapper'>
                    <div>
                        <div className="tag">Latest Deposit</div>
                        {
                            load || fetchLatestDeposit ?
                                <div style={{ width: '100%', height: '30px', border: '1px solid red' }}> <Skeleton /> </div> :

                                !fetchLatestDepositSuccess ?
                                    <div className="err-tag">{fetchDataErrorMsg}</div> :
                                    <Table>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S/N</th>
                                                    <th>Date</th>
                                                    <th>Username</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deposit?.slice(0, count).map((data, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                {data.createdAt && new Date(data.createdAt).toLocaleString()}
                                                            </td>
                                                            <td>{data.userId?.username}</td>
                                                            <td>{data.amountReceived} {data.currency}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </Table>
                        }
                    </div>
                </div>
            </div>

            <div className='table'>
                <div className='table-wrapper'>
                    <div>
                        <div className="tag">Latest Withdrawal</div>

                        {
                            load || fetchLatestWithdrawal ?
                                <div style={{ width: '100%', height: '30px', border: '1px solid red' }}> <Skeleton /> </div> :

                                !fetchLatestWithdrawalSuccess ?
                                    <div className="err-tag">{fetchDataErrorMsg}</div> :
                                    <Table>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S/N</th>
                                                    <th>Date</th>
                                                    <th>Username</th>
                                                    <th>Amount</th>
                                                    <th>Coin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withdrawal?.slice(0, count).map((data, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                {data.createdAt && new Date(data.createdAt).toLocaleString()}
                                                            </td>
                                                            <td>{data.userId?.username}</td>
                                                            <td>{data.amount} {data.currency}</td>
                                                            <td>{data.coin}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </Table>
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.div`
    padding: 20px 0;

    .table {
        display: flex;
        margin: 20px auto;
        justify-content: center;
    }
    
    .table-wrapper {
        display: inline-block;
        padding: 20px;
        min-width: 70%;
        border-top: 2px solid var(--yellow);
        background: var(--gray-light2);

        .tag {
            display: inline-block;
            font-size: 1rem;
            font-weight: 600;
            background: var(--yellow);
            padding: 10px;
            margin-bottom: 25px;
            border-radius: 3px;
            color: #fff;
        }

        .err-tag {
            font-size: .65rem;
            color: red;
        }
    }
`