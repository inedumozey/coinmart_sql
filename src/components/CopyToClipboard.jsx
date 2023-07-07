import React, { useState } from 'react'
import styled from 'styled-components'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';


export default function Copy({ children, copyText, animatedText }) {
    const [isCopied, setIsCopied] = useState(false);

    setTimeout(() => {
        if (isCopied) {
            setIsCopied(false)
        }
    }, 500)

    return (
        <CopyToClipboard text={copyText}
            onCopy={() => setIsCopied(true)}>
            <Wrapper title="Click to copy">
                {children}
                {
                    isCopied ? <div className="copy">{animatedText ? animatedText : "Copied"}</div> : ''
                }
                <div className="copy-icon">
                    <ContentCopyIcon style={{ fontSize: '.9rem' }} />
                </div>
            </Wrapper>
        </CopyToClipboard>
    )
}


const Wrapper = styled.span`
    cursor: copy;
    position: relative;

    .copy {
        font-size: .9rem;
        font-weight: 500;
        top: 0;
        right: 0;
        position: absolute;
        color: red;
        animation: copy 0.5s ease-out alternate;
        z-index: 5;

    }

    @keyframes copy {
        0%{
            color: red;
            opacity: 0;
            top: 0;
            right: 0;
        };
        50% {
            color: red;
            opacity: 1;
            top: -30px;
            right: -15px;
        };
        100%{
            color: red;
            opacity: 0;
            top: -30px;
            right: -15px;
        };
    }

    .copy-icon {
        position: absolute;
        top: -13px;
        right: -13px;

    }
`