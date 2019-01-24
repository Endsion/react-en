import React from 'react';
import { ReactDOM,BrowserRouter,render } from 'react-dom';
/* 防VDC配置 */
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import configureStore from './store/configureStore';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { config } from './locale/config';
import { getToken, decode } from '../src/utils/auth';

import Root from './containers/Root';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

addLocaleData([...zh, ...en]);
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

export function getLocale() {
    const token = decode(getToken());
    let currentLang = '';
    if (token.locale) {
      currentLang = token.locale;
    } else {
      currentLang = (navigator.language || navigator.browserLanguage).toLowerCase();
    }
    let currentLanguage = '';
    if (currentLang.indexOf('zh') > -1) {
      currentLanguage = {
        locale: config.locale,
        messages: config.messages,
      };
    } else if (currentLang.indexOf('en') > -1) {
      currentLanguage = {
        locale: config.localeEn,
        messages: config.messagesEn,
      };
    } else {
      currentLanguage = {
        locale: config.locale,
        messages: config.messages,
      };
    }
  
    return currentLanguage;
  }

render(
    <IntlProvider
      locale={getLocale().locale}
      messages={getLocale().messages}
    >
        <BrowserRouter><Root store={store} history={history} /></BrowserRouter>
    </IntlProvider>
    , document.getElementById('root'));
    
serviceWorker.unregister();
