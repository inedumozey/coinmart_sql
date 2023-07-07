import styled from 'styled-components'
import Skeleton from '../Skeleton'

export default function Skeletons() {
    return (
        <SkeletonStyle>
            <div className="header">
                <div className="stat-wrapper">
                    {
                        [1, 2, 3, 4].map((item, i) => {
                            return <div key={i} className="stat"><Skeleton /></div>
                        })
                    }
                </div>
                <div className="search-wrapper">
                    <div className="search"><Skeleton /></div>
                </div>

            </div>
            <div className="table">
                {
                    [1, 2, 3, 4].map((item, i) => {
                        return <div key={i} className="text"><Skeleton /></div>
                    })
                }
            </div>
            <div className="view-more">
                <div className="more"><Skeleton /></div>
            </div>
        </SkeletonStyle>
    )
}


const SkeletonStyle = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    box-shadow: 2px 2px 4px #ccc;

    .header {
        .stat {
            width: 70px;
            height: 30px;
            padding-bottom: 10px;
        }
        .search-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        .search {
            height: 40px;
            width: 250px;
            max-width: 300px;
        }
    }

    .table {
        padding: 0;
        width: 100%;
        margin: 0px auto 10px auto;

        .text {
            width: 100%;
            height: 30px;
            margin: 20px 0;
            padding-bottom: 3px;
        }
    }

    .view-more {
        display: flex;
        height: 40px;
        justify-content: center;
        align-items: center;

        .more{
            border-radius: 5px;
            height: 100%;
            width: 130px;
        }
    }

`