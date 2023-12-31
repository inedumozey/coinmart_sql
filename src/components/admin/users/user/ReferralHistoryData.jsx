import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import filter from "@mozeyinedu/filter";
import { useSnap } from '@mozeyinedu/hooks-lab';
import Spinner_ from '../../../spinner/Spinner';
import { ScrollBar } from '../../../../styles/globalStyles';
import { Context } from '../../../../context/Context';
import { Link } from 'react-router-dom';

export default function ReferralHistoryData({ referralHxData }) {
    const { config, num } = useContext(Context);
    const { snap } = useSnap(.5)
    const [inp, setInp] = useState('')
    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);
    const [filteredData, setFilter] = useState(referralHxData);

    useEffect(() => {
        const newData = filter({
            data: referralHxData,
            keys: ["referreeUsername", "rewards", "_id"],
            input: inp
        })

        setFilter(newData)

    }, [inp, referralHxData])

    const handleViewMore = () => {
        setOpening(true)

        setTimeout(() => {
            setOpening(false)
            setCount(prevState => prevState + num)
        }, 1000)
    }

    return (
        <Wrapper>
            <div className="search-wrapper">
                <div className="search">
                    <input
                        placeholder='Search by Username and rewards'
                        value={inp || ''}
                        onChange={(e) => setInp(e.target.value)}
                    />
                </div>
            </div>

            <div className="container">

                <div className="panel header">
                    Total bonus {"==> "}
                    <span>
                        {
                            (function () {
                                const amountArr = referralHxData.map(data => {
                                    return data.rewards;
                                })

                                const sum = amountArr.reduce((a, b) => {
                                    return a + b
                                }, 0)

                                return sum
                            }())
                        } {config.configData.currency}
                    </span>
                </div>

                {
                    filteredData?.slice(0, count).map((data, i) => {
                        return data.referreeId ?
                            <Link style={{ textDecoration: 'none' }} to={`/admin/users/${data.referreeId}`}>
                                <div className="panel panel_users">{data.referreeUsername} {"==> "} <span>{data.rewards} {data.currency}</span></div>
                            </Link> :
                            <div className="panel panel_users">{data.referreeUsername} {"==> "} <span>{data.rewards} {data.currency} {data.referreeId ? `(User removed)` : ''}</span></div>


                    })
                }
            </div>
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
    overflow-y: auto;
    ${ScrollBar()}

    .container {
        padding: 5px 10px 0 10px;
    }
    
    .panel {
        padding: 5px 0;
        font-size: .7rem;
        font-weight: bold;
         span {
            color: red;
            font-weight: 500;
         }
        
    }
    .panel_users {
        padding: 10px;
        
        &:hover{
            background: var(--gray-pale);
        }
    }

    .header {
        border-bottom: 1px solid #ccc;
    }
    .tag {
        font-size: .65rem;
        color: red;
    }

    .search {
        display: inline-block;
        margin-bottom: 10px;
        width: 90%;
        max-width: 300px;

        input {
            padding: 5px;
            border-radius: 5px;
            width: 100%;
            border: 1px solid #ccc;
    
            &: focus {
                outline: none;
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