import styled from "styled-components";

export default function Card({ data, type }) {

    return (
        <CardStyle type={type}>
            <div className="title">
                <div>
                    <div>{data.type?.toUpperCase()}</div>
                </div>
                <div className="line">
                    <div className="progres"></div>
                </div>
            </div>
            <div className="body">
                <div className="left">
                    <div style={{ marginBottom: '4px' }}>
                        <div style={{ fontWeight: 600 }}>Started</div>
                        <div className="date">
                            {data.createdAt && new Date(data.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Amount</div>
                        <div style={{ fontSize: '.7rem' }}>{data.amount?.toFixed(2)} {data.currency}</div>
                    </div>
                </div>
                <div className="right">
                    <div style={{ marginBottom: '4px' }}>
                        <div style={{ fontWeight: 600 }}>{data.isActive ? "Matures" : 'Matured'}</div>
                        {
                            data.isActive ?
                                (function () {
                                    let maturein = data && new Date(data.createdAt).getTime() / 1000 + data.lifespan
                                    let formated = new Date(maturein * 1000);


                                    return (
                                        <div className="date">
                                            {formated && new Date(formated).toLocaleString()}
                                        </div>
                                    )
                                }()) :
                                <div className="date">
                                    {data.createdAt && new Date(data.updatedAt).toLocaleString()}
                                </div>
                        }
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Returns <span style={{ color: 'var(--yellow)' }}>{data.returnPercentage}%</span></div>
                        <div style={{ fontSize: '.7rem' }}>{data.rewards?.toFixed(2)} {data.currency}</div>
                    </div>
                </div>
            </div>
        </CardStyle>
    )
}



const CardStyle = styled.div`
    width: 260px;
    height: 150px;
    border-radius: 5px;
    margin: 5px;
    padding: 10px;
    box-shadow: 2px 2px 4px #aaa, -2px -2px 4px #aaa;

    @media (max-width: ${({ theme }) => theme.sm_screen}){
        width: 90vw;
    }


    .date {
        font-size: .6rem;
        color: var(--yellow);
    }

    .title{
        text-align: left;
        height: 25px;
        color: var(--blue);
    }

    .line{
        height: 3px;
        width: 100%;
        border: 1px solid var(--blue);
        display: flex;
        align-items: center;   
        
        .progres{
        width:  ${({ type }) => type?.toLowerCase() === 'active' ? `50%` : `100%`};
        height: 2px;
        background: var(--blue);
        }
    }

    .body{
        height: calc(100% - 25px);
        display: flex;
        align-items: center;
        font-size: .8rem;
        margin-top: 5px;

        .left, .right{
        width: 50%;
        height: 100%;
        padding-top: 3px;
        padding: 5px;
        }

        .right {
            background: #f9f9f9a6;
        }
    }

`
