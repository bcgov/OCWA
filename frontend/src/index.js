import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { commit, version } from '@src/services/config';

import App from 'modules/app/containers/app';
import createStore from './services/store';
import reducers from './reducers';
import sagas from './sagas';

const containerEl = document.getElementById('main');

/* eslint-disable no-console */
console.log('-------------------------');
console.log('OCWA');
console.log(`Version: ${version}`);
console.log(`Commit: ${commit}`);
console.log('-------------------------');
/* eslint-enable no-console */

const store = createStore(reducers, sagas);
/* eslint-disable react/jsx-filename-extension */
const renderApp = () =>
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    containerEl
  );
/* eslint-enable react/jsx-filename-extension */

renderApp();

if (__DEV__) {
  if (module.hot) {
    module.hot.accept('./modules/app/containers/app', () => renderApp());

    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default; // eslint-disable-line
      store.replaceReducer(nextReducer);
    });
  }
}
