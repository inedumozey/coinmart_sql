import styled from 'styled-components'

export default function Marquee({children}) {
  return (
    <Wrapper>
      <Content>
        {children}
      </Content>
    </Wrapper>
  )
}


const Wrapper = styled.div`
    width: 100%;
    height: 100px;
    background: #555;
    white-space: no-wrap;
    overflow: hidden;
`
const Content = styled.div`
    height: 100%;
    animation: marquee 10s linear infinite;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      animation-play-state: paused
    }

  @keyframes marquee {
    0% {
      transform: translateX(0%)
    }
    100% {
      transform: translateX(-100%)
    }
  }
`