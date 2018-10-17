import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

const devTool = window.devToolsExtension ? window.devToolsExtension() : f => f;

export default function(reducers, sagas) {
  const enhancers = [devTool];
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
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
