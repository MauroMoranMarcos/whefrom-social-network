import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';

import store from './store';
import {App} from './modules/app';
import backend from './backend';
import {NetworkError} from './backend';
import app from './modules/app';
import {initReactIntl} from './i18n';
import './styles.css';

import {createTheme, ThemeProvider} from "@mui/material";
import {blueGrey, lightBlue} from "@mui/material/colors";

/* Configure backend proxy. */
backend.init(error => store.dispatch(app.actions.error(new NetworkError())));

/* Configure i18n. */
const {locale, messages} = initReactIntl();

/* Render application. */
const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    palette: {
        primary: {
            main: '#9575cd',
        },
        secondary: {
            main: '#673ab7',
        },
        alertRed: {
            main: '#FF3700'
        },
        alertOrange: {
            main: '#FF7700'
        },
        like: {
            main: '#E60000'
        },
        greenCheck: {
            main: '#039705'
        },
        disabled: {
            main: '#727272'
        },
        lightGreen: {
            main: '#16DB65'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h12: {
            fontSize: '2.0rem',
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.4rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h21: {
            fontSize: '1.0rem',
            fontWeight: 400,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: '0.9rem',
            fontWeight: 400,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: '0.8rem',
            fontWeight: 400,
            lineHeight: 1.2,
        },
    },
});

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <IntlProvider locale={locale} messages={messages}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </IntlProvider>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>);

export default theme;
