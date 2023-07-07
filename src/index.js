import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import { GlobalStyle } from './styles/globalStyles';
import { ThemeProvider } from 'styled-components'
import ScrollToTop from 'react-scroll-to-top';
import {
  BrowserRouter,
} from "react-router-dom";
import ToastContainer_ from './components/ToastContainer';


const theme = {
  sm_screen: '600px',
  md_screen: '900px',
  xl_screen: '1500px',
  lg_screen: '1000px',
  lg_padding: '60px',
  md_padding: '25px',
  sm_padding: '15px',
  transition: '.4s'
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <ToastContainer_ />
          {/* <ScrollToTop style={{ background: 'rgba(0,0,0,.2)' }} smooth /> */}
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
