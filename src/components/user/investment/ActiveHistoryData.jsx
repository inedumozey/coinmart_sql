import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Spinner_ from '../../spinner/Spinner';
import { Context } from '../../../context/Context';
import { useSnap } from '@mozeyinedu/hooks-lab';
import filter from "@mozeyinedu/filter";

import Card from './Card';

export default function ActiveHistoryData({ data }) {
    const { snap } = useSnap(.5);
    const [inp, setInp] = useState('')
    const { num } = useContext(Context);

    const [count, setCount] = useState(num);
    const [opening, setOpening] = useState(false);


    // filter
    const [filteredData, setFilter] = useState(data);

    useEffect(() => {
        const newData = filter({
            data: data,
            keys: ['amount', "_id", "returnPercentage", "lifespan", "status", "type", "transactionType"],
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


    return (
        <>
            <Wrapper className="matured">
                <div className="header">
                    <div className="stat-wrapper">
                        <div className="stat">
                            <div>Total: <span style={{ color: 'red' }}>{data?.length}</span></div>
                        </div>

                    </div>
                    {
                        data.length ? <div className="search-wrapper">
                            <div className="search">
                                <input
                                    placeholder='Search by Amount, Plan type, lifespan, returnPercentage, id'
                                    value={inp || ''}
                                    onChange={(e) => setInp(e.target.value)}
                                />
                            </div>
                        </div>
                            : ''
                    }
                </div>
                <Container>
                    {
                        filteredData.length < 1 ? "" :
                            (
                                filteredData.slice(0, count).map((data, i) => {
                                    return <Card key={i} data={data} type="matured" />
                                })
                            )
                    }
                </Container>
            </Wrapper>

            {
                count >= filteredData.length ? '' :

                    <ViewMore>

                        <div onClick={handleViewMore} className="more" {...snap()}>
                            {opening ? <div className='center'> <Spinner_ size="sm" /></div> : 'View more...'}
                        </div>
                    </ViewMore>
            }
        </>
    )
}


const Container = styled.div`

margin: auto;
display: flex;
font-size: .8rem;
justify-content: center;
flex-wrap: wrap;
align-items: center;

    .tag {
        font-size: .65rem;
        color: red;
    }

    .title {
        color: var(--blue);
        font-weight: 600;
        color: var(--blue);
        font-size: .9rem;
    }

    .active {
        border-bottom 1px solid #ccc;
    }   
`

const Wrapper = styled.div`
    
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