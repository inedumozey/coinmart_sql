import Accordion from 'react-bootstrap/Accordion';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

export default function DepositCard({ data }) {
    return (
        <Card>
            <Accordion style={{ background: 'transparent' }}>
                <Accordion.Item eventKey="0">

                    <Accordion.Header>
                        <div className="header">
                            <div className="deposit title">Deposit</div>

                            {(function () {
                                if (data.status?.toLowerCase() === 'charge-confirmed') {
                                    return (
                                        <div className="summary confirmed">
                                            Your deposit of the sum of {data.amountReceived} {data.currency} was successful
                                        </div>
                                    )
                                }

                                else if (data.status?.toLowerCase() === 'charge-created') {
                                    return (
                                        <div className="summary pending">
                                            You initiated a deposit of {data.amountExpected} {data.currency}
                                        </div>
                                    )
                                }

                                else if (data.status?.toLowerCase() === 'charge-pending') {
                                    return (
                                        <div className="summary pending">
                                            Your deposit of the sum of {data.amountExpected} {data.currency} is pending
                                        </div>
                                    )
                                }

                                else if (data.status?.toLowerCase() === 'charge-failed') {
                                    return (
                                        <div className="summary failed">
                                            Your deposit of the sum of {data.amountExpected} {data.currency} failed
                                        </div>
                                    )
                                }

                                else {
                                    return ''
                                }
                            }())}

                            <div className="date">
                                {data.createdAt && new Date(data.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </Accordion.Header>

                    <Accordion.Body>
                        <div className="body">
                            <div className="content">
                                Code: <span>{data.code}</span>
                            </div>
                            <div className="content">
                                Track: <span onClick={() => window.open(data.link, '_blank')}><Link>Link</Link></span>
                            </div>
                            <div className="content">
                                Transaction id: <span>{data._id}</span>
                            </div>
                        </div>
                    </Accordion.Body>

                </Accordion.Item>

            </Accordion>
        </Card>
    );
}

const Card = styled.div`
    width: 260px;
    border-radius: 5px;
    margin: 5px;
    padding: 5px;
    box-shadow: 2px 2px 4px #aaa, -2px -2px 4px #aaa;

    .header, .body {
        width: 100%;
    }

    .title{
        font-size: .8rem;
        width: 100%;
    }
    .summary {
        font-size: .8rem;
        padding: 5px 2px 15px 5px;

    }
    .date {
        color: var(--yellow);
        font-size: .7rem;
        width: 100%;
    }
    .content {
        font-size: .8rem;
        font-weight: bold;

        span {
            font-weight: 400;
        }
    }
`