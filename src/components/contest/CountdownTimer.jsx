import Countdown from 'react-countdown';
import { useState } from "react";
import styled from 'styled-components'

export default function CountdownTimer({ stopDate, startDate }) {
    const [start, setStart] = useState(true)
    const [stop, setStop] = useState(false)

    return (
        <Wrapper>
            <div style={{ display: 'flex' }}>
                <span
                    style={{
                        fontWeight: 'bold',
                        borderRadius: '6px',
                    }}>
                    {
                        !start ? '' :
                            <div>
                                Starts In: <Countdown renderer={({ days, hours, minutes, seconds, completed }) => {
                                    if (completed) {
                                        setStart(false)
                                    } else {
                                        return (
                                            <>
                                                <span className='time'>{days}</span> : {" "}
                                                <span className='time'>{hours}</span> : {" "}
                                                <span className='time'>{minutes}</span> : {" "}
                                                <span className='time'>{seconds}</span>
                                            </>
                                        )
                                    }
                                }} date={new Date(startDate)}>
                                </Countdown>
                            </div>
                    }

                    {
                        !stop && !start ?
                            <div>
                                Stops In: <Countdown renderer={({ days, hours, minutes, seconds, completed }) => {
                                    if (completed) {
                                        setStop(true)
                                    } else {
                                        return (
                                            <>
                                                <span className='time'>{days}</span> : {" "}
                                                <span className='time'>{hours}</span> : {" "}
                                                <span className='time'>{minutes}</span> : {" "}
                                                <span className='time'>{seconds}</span>
                                            </>
                                        )
                                    }
                                }} date={new Date(stopDate)}>
                                </Countdown>
                            </div> : ''
                    }

                    {stop && !start ? <div style={{ color: 'red' }}>Contest is Over</div> : ''}
                </span>
            </div>

        </Wrapper>
    )
}


const Wrapper = styled.div`
    
    .time {
        display: inline-block;
        background: #c20;
        color: #fff;
        padding: 2px 5px;
        border-radius: 3px;
        cursor: default;
    }
`