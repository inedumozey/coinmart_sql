import Countdown from 'react-countdown';
import { useState, useEffect } from "react";

export default function CountdownTimer({startDate, stopDate}){
    const [start, setStart] = useState(true)
    const [stop, setStop] = useState(false)
  
    return (
      <>
      <div style={{display: 'flex', justifyContent: 'center',}}>
        <span style={{
          textAlign: 'center', 
          background: (
            function(){
              if(stop && !start){
                return '#c10'
              }
              else if(start){
                return 'var(--bright-color)'
              }
              else if(!stop && !start){
                return 'var(--major-color-purest)'
              }
            }()
          ), 
          color: (
            function(){
              if(stop && !start){
                return '#fff'
              }
              else if(start){
                return 'inherit'
              }
              else if(!stop && !start){
                return '#fff'
              }
            }()
          ),
          padding: '7px',
          fontWeight: 'bold',
          borderRadius: '6px',}}>
            {
              !start ? '' : 
              <div>
                Starts In: <Countdown renderer={({days, hours, minutes, seconds, completed})=>{
                  if(completed){
                    setStart(false)
                  }else{
                    return <span>{days} : {hours} : {minutes} : {seconds}</span>
                  }
                }} date={new Date(startDate)}>
                </Countdown>
              </div>
            }
  
            {
              !stop && !start ? 
              <div>
                  Stops In: <Countdown renderer={({days, hours, minutes, seconds, completed})=>{
                    if(completed){
                      setStop(true)
                    }else{
                      return <span>{days} : {hours} : {minutes} : {seconds}</span>
                    }
                  }} date={new Date(stopDate)}>
                  </Countdown>
              </div> : ''
            }
  
            {stop && !start ? <div style={{color: '#fff'}}>Contest is Over</div> : ''}
        </span>
      </div> 
        
      </>
    )
  }