import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'modules/app/containers/app';
import createStore from './services/store';
import reducers from './reducers';
import sagas from './sagas';

const containerEl = document.getElementById('main');

const store = createStore(reducers, sagas);
const renderApp = () =>
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    containerEl
  );

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
