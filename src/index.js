import React from 'react';
import { render } from 'react-dom';
import Router from './components/Router';
import './i18n';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

render(
  <I18nextProvider i18n={i18next}>
    <Router />
  </I18nextProvider>,
  document.querySelector('#main-0bs-div')
);
