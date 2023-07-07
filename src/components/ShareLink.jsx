import React, { useContext } from 'react'
import { Context } from '../context/Context';
import ShareIcon from '@mui/icons-material/Share';
import Copy from './CopyToClipboard';
import styled from 'styled-components'
import Modal from './Modal';
import {
    EmailShareButton,
    FacebookShareButton,
    HatenaShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    HatenaIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon

} from "react-share";

export default function ShareLink({ refcode }) {
    const { sharelink } = useContext(Context);
    const {
        shareLinkModal,
        setShareLinkModal
    } = sharelink

    return (
        <>
            <span
                title="Share Link"
                style={{ cursor: 'pointer' }}
                onClick={() => setShareLinkModal(!shareLinkModal)}
            >
                <ShareIcon style={{ color: 'var(--green', fontSize: '1.2rem' }} />
            </span>
            <Modal
                show={shareLinkModal}
                onHide={setShareLinkModal}
                title="Share Link"
            >
                <Share refcode={refcode} />
            </Modal>
        </>
    )
}

const Share = ({ refcode }) => {
    const url = `${process.env.REACT_APP_FRONTEND_BASE_URL}/auth/signup/?refcode=${refcode}`;
    const { sharelink } = useContext(Context);
    const {
        setShareLinkModal
    } = sharelink

    return (
        <ShareStyle>
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <FacebookShareButton url={url}>
                        <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <LinkedinShareButton url={url}>
                        <LinkedinIcon size={32} round={true} />
                    </LinkedinShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <PinterestShareButton url={url}>
                        <PinterestIcon size={32} round={true} />
                    </PinterestShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <RedditShareButton url={url}>
                        <RedditIcon size={32} round={true} />
                    </RedditShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <TelegramShareButton url={url}>
                        <TelegramIcon size={32} round={true} />
                    </TelegramShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <WhatsappShareButton url={url}>
                        <WhatsappIcon size={32} round={true} />
                    </WhatsappShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <EmailShareButton url={url}>
                        <EmailIcon size={32} round={true} />
                    </EmailShareButton>
                </div>

                <div onClick={() => setShareLinkModal(false)} className="shareBtn">
                    <Copy copyText={url}>Copy</Copy>
                </div>
            </div>
        </ShareStyle>
    )
}


const ShareStyle = styled.div`
    display: flex;
    justify-content: center;
    align-itmes: center;


    .shareBtn {
        margin: 5px;
    }

`