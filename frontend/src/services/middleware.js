import ky from 'ky';

const logError = (error, state, action) => {
  ky.post('/log', {
    json: {
      state,
      action,
      error,
    },
  });
};

/**
   Crash Reporter lifted directly from the Redux docs.
  */
export const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    const state = store.getState();
    console.error('[ERROR]', err);

    logError(err, state, action);

    throw err;
  }
};

export const errorReporter = store => next => action => {
  if (action.error) {
    const state = store.getState();

    logError(action.type, state, action);
  }

  return next(action);
};
