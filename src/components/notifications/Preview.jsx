import Badge from 'react-bootstrap/Badge';
import styled from 'styled-components';

export default function Preview({ data, type }) {

    return (
        <Wrapper>
            <h5 style={{ color: 'var(--blue' }} className="title">{data.subject && data.subject}</h5>
            <div style={{ color: 'var(--yellow', fontSize: '.7rem' }} className="date">{data.createdAt && new Date(data.createdAt).toLocaleString()}</div>
            {
                type === 'new' ?
                    <div className="badge">
                        <Badge bg="danger">New</Badge>
                    </div> : ''
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;

    .badge {
        position: absolute;
        top: 0;
        right: 0;
    }
`