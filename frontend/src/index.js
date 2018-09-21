import React from 'react';
import { render } from 'react-dom';
import App from './components/app/index.jsx';

const containerEl = document.getElementById('main');
const renderApp = () => render(<App />, containerEl);

renderApp();

if (module.hot) {
  module.hot.accept('./components/app/index.jsx', function() {
    renderApp();
  });
}
