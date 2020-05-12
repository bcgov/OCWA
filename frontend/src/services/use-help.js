import { useCallback, useReducer } from 'react';
import { help } from './config';

export function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        status: 'loading',
      };

    case 'SUCCESS':
      return {
        ...state,
        status: 'success',
        data: action.payload,
      };

    case 'FAILED':
      return {
        ...state,
        error: action.payload,
        status: 'error',
      };

    default:
      throw new Error();
  }
}

function useHelp(id) {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    status: 'idle',
    error: null,
  });

  const request = useCallback(async () => {
    dispatch({ type: 'LOADING' });

    try {
      const url = `${help.url}/api/v1/article/ocwa/${id}`;
      const res = await fetch(url, {
        method: 'GET',
      });

      if (res.ok) {
        const payload = await res.json();
        dispatch({ type: 'SUCCESS', payload });
      } else {
        dispatch({
          type: 'FAILED',
          payload: `${res.status} - ${res.statusText}`,
        });
      }
    } catch (err) {
      dispatch({ type: 'FAILED', payload: err.message });
    }
  }, [dispatch, help, id]);

  return { ...state, request };
}

export default useHelp;
