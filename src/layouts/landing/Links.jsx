import { Link, useLocation } from "react-router-dom";
import styled from 'styled-components'

export default function Links({ link }) {
    const location = useLocation();

    return (
        <Wrapper>
            {link.map((link, i) => {
                return <Link key={i} to={link.url} className={location.pathname === link.url ? 'link active' : 'link'}>{link.name?.toUpperCase()}</Link>
            })}
        </Wrapper>
    )
}


const Wrapper = styled.div`
    .link {
        color: #000;
        padding: 0 2px;
        margin: 0 5px;
        font-weight: 600;
    }

    .active{
        border-bottom: 2px solid var(--yellow);
    }
`