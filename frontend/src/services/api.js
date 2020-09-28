import ky from 'ky';
import has from 'lodash/has';

import { getToken } from './auth';

async function handleError(err) {
  const { response } = err;
  let errorMessage = has(response, 'statusText') ? response.statusText : '';

  try {
    const { error, message } = await response.json();
    errorMessage = error || message;
  } catch {
    throw new Error(errorMessage);
  }

  throw new Error(errorMessage);
}

export const get = async (url, options) => {
  try {
    const token = getToken();
    const json = await ky
      .get(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    return handleError(err);
  }
};

export const post = async (url, options) => {
  try {
    const token = getToken();
    const json = await ky
      .post(url, {
        ...options,
        timeout: 60000,
        json: options.payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    return handleError(err);
  }
};

export const put = async (url, options) => {
  try {
    const token = getToken();
    const json = await ky
      .put(url, {
        ...options,
        timeout: 120000,
        json: options.payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    return handleError(err);
  }
};

export const destroy = async (url, options) => {
  try {
    const token = getToken();
    const json = await ky
      .delete(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    return handleError(err);
  }
};

export default {
  get,
  post,
  put,
  destroy,
};
