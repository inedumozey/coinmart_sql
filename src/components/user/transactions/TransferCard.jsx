import Accordion from 'react-bootstrap/Accordion';
import styled from 'styled-components';

export default function TransferCard({ data, profileData }) {
    console.log(data)

    return (
        <Card>
            <Accordion style={{ background: 'transparent' }}>
                <Accordion.Item eventKey="0">

                    <Accordion.Header>
                        <div className="header">
                            <div className="transfer title">Transfer</div>

                            {(function () {
                                if (data.senderUsername === profileData.username) {
                                    return (
                                        <div className="summary sent">
                                            You transfered the sum of {data.amount} {data.currency} to {data.receiverUsername}
                                        </div>
                                    )
                                }


                                else if (data.receiverUsername === profileData.username) {
                                    return (
                                        <div className="summary confirmed">
                                            You received the sum of {data.amount} {data.currency} from {data.senderUsername}
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