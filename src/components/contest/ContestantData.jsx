import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";
import { Table } from '../../styles/globalStyles';
import { Context } from '../../context/Context';
import Cookies from 'js-cookie';
import Spinner_ from '../spinner/Spinner';
import resolve from '../../utils/resolve';
import CountdownTimer from './CountdownTimer';
import Btn from '../Btn/Btn';
import apiClass from '../../utils/api';
import Modal from '../Modal';
import ContestPrize from './ContestPrize';
import MoreInfo from './MoreInfo';

const position = resolve.position;

const api = new apiClass()

export default function ContestantData({ data }) {
    const { snap } = useSnap(.5)
    const { config, referralContest, num } = useContext(Context);
    const [inp, setInp] = useState('');

    const [showModal_prize, setShowModal_prize] = useState(false)
    const [showModal_info, setShowModal_info] = useState(false)

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);

    const {
        setFetchingContestants_refresh,
        setContestantData,
        reseting,
        setReseting,
        resolving,
        setResolving,
    } = referralContest;

    const [filteredData, setFilter] = useState(data);

    useEffect(() => {
        const newData = filter({
            data: data,
            keys: ["amount", 'username', "point", 'rewards', "_id", "position"],
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

    const handleReset = () => {
        setReseting(true)

        // if accesstoken not there, refresh it before proceeding, otherwise, proceeding straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.resetContest(setReseting, setFetchingContestants_refresh, setContestantData)
            }, 2000);
        }
        else {
            api.resetContest(setReseting, setFetchingContestants_refresh, setContestantData)
        }
    }

    const handleResolve = () => {
        setResolving(true)

        // if accesstoken not there, refresh it before proceeding, otherwise, profile straight up
        if (!Cookies.get('accesstoken')) {
            api.refreshToken()
            setTimeout(() => {
                api.resolveContest(setResolving, setFetchingContestants_refresh, setContestantData)
            }, 2000);
        }
        else {
            api.resolveContest(setResolving, setFetchingContestants_refresh, setContestantData)
        }
    }


    return (
        <Wrapper>

            <div className="header">
                <div className="stat-wrapper">
                    <div className="stat">
                        <div>Total Contestants: <span style={{ color: 'red' }}>{data.length}</span></div>
                    </div>
                    {
                        !config.configData.allowReferralContest ? <div className="tag">Contest is currently not available</div> :
                            <div className="stat">
                                <div>Contest Starts At: {config.configData && new Date(config.configData.referralContestStarts).toLocaleString()}</div>
                                <div>Contest Stops At: {config.configData && new Date(config.configData.referralContestStops).toLocaleString()}</div>
                                <CountdownTimer stopDate={config.configData.referralContestStops} startDate={config.configData.referralContestStarts} />
                            </div>
                    }
                </div>

                {
                    Cookies.get('role')?.toLowerCase() === "admin" && Cookies.get('extratoken') && Cookies.get('refreshtoken') ?


                        <div className="search-wrapper">
                            <div style={{ marginRight: '5px' }}>
                                <Btn
                                    disabled={reseting}
                                    onClick={handleReset}
                                    color="var(--blue)"
                                    link={false}
                                >
                                    {reseting ? <Spinner_ size="sm" /> : "Reset"}
                                </Btn>
                            </div>
                            <Btn
                                disabled={resolving}
                                onClick={handleResolve}
                                color="var(--blue)"
                                link={false}
                            >
                                {resolving ? <Spinner_ size="sm" /> : "Resolve"}
                            </Btn>
                        </div> : ''
                }

                <div className="search-wrapper">
                    <div className="search">
                        <input
                            placeholder='Search by Username, Amount, Point, Rewards, _id'
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
                            <th>Position</th>
                            <th>Date</th>
                            <th>Username</th>
                            {
                                Cookies.get('role')?.toLowerCase() === "admin" && Cookies.get('extratoken') && Cookies.get('refreshtoken') ?
                                    <th>Current Balance {`(${config.configData.currency})`}</th> : ''
                            }
                            <th>Downlines</th>
                            <th>Points</th>
                            <th>Rewards</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.slice(0, count).map((data, i) => {
                            return (
                                <tr key={data._id}>
                                    <td>
                                        {data.position !== null ? data.position : i + 1}{position(data.position !== null ? data.position : i + 1)}
                                    </td>
                                    <td>
                                        {data.createdAt && new Date(data.createdAt).toLocaleString()}
                                    </td>
                                    <td>{data.userId?.username}</td>
                                    {
                                        Cookies.get('role')?.toLowerCase() === "admin" && Cookies.get('extratoken') && Cookies.get('refreshtoken') ?
                                            <td>{data.userId?.amount}</td> : ''
                                    }
                                    <td>{data.userId?.referreeId.length}</td>
                                    <td>{data.point}</td>
                                    <td>{data.rewards} {data.currency}</td>
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

            <div className="actions">
                <div onClick={() => { setShowModal_prize(true) }} className="view">View Prizes</div>
                <div onClick={() => { setShowModal_info(true) }} className="view">More Info</div>
            </div>

            {/* modal to view more info*/}
            <Modal
                show={showModal_info}
                onHide={setShowModal_info}
                title="Contest Info"
            >
                <MoreInfo />
            </Modal>

            {/* modal to view contest Prizes */}
            <Modal
                show={showModal_prize}
                onHide={setShowModal_prize}
                title="Contest Prizes"
            >
                <ContestPrize config={config.configData} />
            </Modal>

        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    box-shadow: 2px 2px 4px #ccc;
    position: relative;

    .header {
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 5px;
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

    .actions {
        position: absolute;
        top: 5px;
        right: -6px;
        user-select: none;
        text-align: center;
        border-radius: 15px;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .view {
            cursor: pointer;
            padding: 1px 8px;
            font-size: .8rem;
            margin-right: 10px;
            color: #fff;
            background: rgb(0 123 255 / 43%);
            border: 1px solid rgb(0 123 255 / 43%);
            transition: ${({ theme }) => theme.transition};
            text-align: center;
            border-radius: 15px;

            &:hover {
                background: rgb(255 255 255 / 43%);
                border: 1px solid rgb(0 123 255 / 43%);
                color: var(--blue);
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