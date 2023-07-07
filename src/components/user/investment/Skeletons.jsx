import React from 'react'
import styled from 'styled-components'
import Skeleton from '../../Skeleton'

export default function Skeletons() {
  return (
    <SkeletonStyle>
      <div className="header">
        <div className="stat-wrapper">
          <div className="stat margin">
            <div>
              <div className='prop'><Skeleton /></div>
              <div className="sub-stat">
                <div className="stat">
                  <Skeleton />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="search-wrapper">
          <div className="search"><Skeleton /></div>
        </div>
      </div>
      <SubWrapper>
        {[1, 2, 3].map((item, i) => {
          return (
            <Card key={i}>
              <div className="header">
                <div className='prop' style={{ width: '100px' }}><Skeleton /></div>

                <div className="summary">
                  <div className="stat"><Skeleton /></div>
                  <div className="stat"><Skeleton /></div>
                  <div className="stat"><Skeleton /></div>
                </div>

                <div className="stat" style={{ width: '100px' }}><Skeleton /></div>
              </div>
            </Card>
          )
        })}
      </SubWrapper>
    </SkeletonStyle>
  )
}

const SkeletonStyle = styled.div`
.header {
    .search-wrapper {
        display: flex;
        justify-content: flex-end;
    }
    .stat-wrapper {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 5px;
    }
    .prop { 
        width: 100px;
        height: 12px;
    }
    .margin {
        margin-right: 5px;
    }
    .sub-stat {

        .stat {
            width: 40%;
            height: 10px;
            padding: 2px 0;
        }
    }

    .search {
        display: inline-block;
        margin-bottom: 10px;
        width: 40%;
        max-width: 300px;
        min-width: 200px;
        height: 30px
    }
}
`
const SubWrapper = styled.div`
    margin: auto;
    display: flex;
    font-size: .8rem;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`

const Card = styled.div`
    width: 260px;
    border-radius: 5px;
    margin: 5px;
    padding: 10px;
    height: 100px;
    box-shadow: 2px 2px 4px #aaa, -2px -2px 4px #aaa;


    .summary {
        font-size: .6rem;
        padding: 5px 2px 15px 5px;

    }

    .stat {
        width: 100%;
        height: 10px;
        padding: 2px 0;
    }
`