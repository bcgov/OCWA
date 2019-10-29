import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { crashReporter, errorReporter } from './middleware';

const devTool = window.devToolsExtension ? window.devToolsExtension() : f => f;

export default function(reducers, sagas) {
  const enhancers = [devTool];
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, errorReporter, crashReporter];

  if (__DEV__) {
    middleware.push(createLogger());
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );
  const store = createStore(reducers, composedEnhancers);

  sagaMiddleware.run(sagas);

  return store;
}
