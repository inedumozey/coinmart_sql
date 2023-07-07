import styled from 'styled-components';
const url = 'https://bit2me.com/widget/crypto-carousel/v1'

export default function Trade() {
  return (
    <Wrapper>
      <Content src={url} />
    </Wrapper>
  )
}


const Wrapper = styled.div`
    width: 100%;
    height: 41px;
    background: #044e97;
    overflow: hidden;
`
const Content = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
`