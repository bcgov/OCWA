import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '../modules/app/containers/app';
import createStore from './store';

const containerEl = document.getElementById('main');

const createApp = (reducers, sagas, Component) => {
  const store = createStore(reducers, sagas);
  const renderApp = () =>
    render(
      <Provider store={store}>
        <Router>
          <App>
            <Component />
          </App>
        </Router>
      </Provider>,
      containerEl
    );

  renderApp();

  return {
    render: renderApp,
    store,
  };
};

export default createApp;
