import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Context } from '../../../../context/Context'
import Spinner_ from '../../../spinner/Spinner'
import { Table } from '../../../../styles/globalStyles'
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";

export default function ConfirmedData() {
    const { snap } = useSnap(.5)
    const { config, admin, num } = useContext(Context);
    const [inp, setInp] = useState('')

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);

    const { confirmedWithdrawalData } = admin.withdrawal

    const [filteredData, setFilter] = useState(confirmedWithdrawalData);

    useEffect(() => {
        const newData = filter({
            data: confirmedWithdrawalData,
            keys: ["username", "email", 'walletAddress', "amount", "coin", "status", "_id"],
            input: inp
        })

        setFilter(newData)

    }, [inp, confirmedWithdrawalData])

    const handleViewMore = () => {
        setOpening(true)

        setTimeout(() => {
            setOpening(false)
            setCount(prevState => prevState + num)
        }, 1000)
    }

    return (
        <Wrapper>
            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total: {confirmedWithdrawalData?.length}</div>
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
                            <th>Amount</th>
                            <th>Wallet</th>
                            <th>coin</th>
                            <th>Status</th>

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
                                    <td>{data.amount} {data.currency}</td>
                                    <td>{data.walletAddress}</td>
                                    <td>{data.coin}</td>
                                    <td>{data.status}</td>
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
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    box-shadow: 2px 2px 4px #ccc;

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