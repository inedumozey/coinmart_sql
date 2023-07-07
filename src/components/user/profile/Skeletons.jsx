import styled from 'styled-components'
import Skeleton from '../../Skeleton';
import Btn from '../../Btn/Btn';

export default function Skeletons() {

    return (
        <Wrapper>
            <SubWrapper>
                <div className="img"><Skeleton type="round" /></div>

                {
                    [1, 2, 3, 4, 5].map((item, i) => {
                        return (
                            <div key={i} className="user">
                                <span style={{
                                    width: '150px',
                                    height: '20px',
                                    display: 'inline-block'
                                }}>
                                    <Skeleton /></span>
                            </div>
                        )
                    })
                }

            </SubWrapper>

            <SubWrapper>
                {
                    [1, 2, 3, 4].map((item, i) => {
                        return (
                            <InputWrapper key={i}>
                                <span style={{
                                    width: '150px',
                                    height: '20px',
                                    display: 'inline-block'
                                }}>
                                    <Skeleton /></span>
                            </InputWrapper>
                        )
                    })
                }
            </SubWrapper>

            <SubWrapper>
                <div className="tag">Reset Password</div>
                {
                    [1, 2, 3].map((item, i) => {
                        return (
                            <InputWrapper key={i}>
                                <span style={{
                                    width: '150px',
                                    height: '20px',
                                    display: 'inline-block'
                                }}>
                                    <Skeleton /></span>
                            </InputWrapper>
                        )
                    })
                }
            </SubWrapper>

        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;

    .user {
        margin-bottom: 10px;
        .name {
            font-weight: bold;
        }
    }

    .img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid #ccc;
        margin: 0px 0px 20px 0;

        @media (max-width: ${({ theme }) => theme.sm_screen}){
            margin: auto auto 20px auto;
        }
    }
`

const SubWrapper = styled.div`
    background: #fff;
    min-height: 60px;
    padding: 20px;
    width: 100%;
    margin: 10px auto 40px auto;
    box-shadow: 2px 2px 5px #ccc;
`

const InputWrapper = styled.div`
    width: 100%;
    height: 45px;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
`