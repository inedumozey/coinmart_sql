import styled, { createGlobalStyle, css } from "styled-components";

const ScrollBar = () => css`
  &::-webkit-scrollbar-thumb {
    background-color: #e5e3e3;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-track {
    background-color: #F0F4F5;
  }
  &::-webkit-scrollbar-corner {
    background-color: #00415D30;
  }
  &::-webkit-scrollbar {
    width: .7rem;
    height: .7rem;
  }
  & {
    -ms-overflow-style: auto;
    scrollbar-color:#00415D30;
    scrollbar-width: thin;
  }
`

const GlobalStyle = createGlobalStyle`
    :root{
        --blue: #007bff;
        --blue2: #3269a5;
        --blue-deep: #6861ce;
        --purple: #6f42c1;
        --purple2: #b91ca8;;
        --pink: #e62ecf;
        --red: #dc3545;
        --orange: #fd7e14;
        --yellow: #E6922E;
        --green: #19b306;
        --green2: #1AA15F;;
        --teal: #20c997;
        --cyan: #17a2b8;
        --white: #fff;
        --gray: #6c757d;
        --gray-dark: #343a40;
        --gray-light: #bdbdbd40;
        --gray-light2: #fafafa;;
        --gray-pale: #eaefee;
        --primary: #007bff;
        --secondary: #6c757d;
    }

    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
    
    body{
        transition: background .3s ease-in;
        position: relative;
        min-height: 100vh;
        min-height: auto;
        overflow-x: hidden;
        color: #000000bf;
        font-size: .9rem;
        

        .bs-container {
          padding: 0;
          margin: 0;
        }

        .center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
    
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        ${ScrollBar()}

        .swiper-button-next, .swiper-button-prev {
            color: var(--major-cclicked={clicked} index={index} isActive={isActive}olor-purest);
        };

        .stat {
          font-size: .7rem;
        }
        
        .link {
            padding: 0;
            border: none;
            color: #fff;
        }

        .active-icon{
            border: 2px solid var(--bright-color)
        }
    }
`

const Table = styled.div`
    width: 100%;
    // max-height: 63vh;
    overflow: auto;
    margin: 0px auto 10px auto;

    ${ScrollBar()}

    table{
        font-size: .7rem;
        margin: auto;
        border-spacing: 0.5rem;
        height: 100%;
        border-collapse: collapse;
        text-align: left;
        cursor: default;
        color: #000;
    }

    td, th {
        border: 1px solid #999;
        padding: 0.5rem;
        text-align: left;
        padding: 10px;
    }

    th{
        background: var(--blue-deep);
        color: #fff;
    }

    tr:nth-child(even) {
      background: #333;;
      color: #fff;

      &:hover {
        opacity: .7;
    }
  }

    tbody tr:hover {
        opacity: .5;
    }

`

export {
  GlobalStyle,
  ScrollBar,
  Table,
};