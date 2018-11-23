import ky from 'ky';

import { getSession } from './auth';

export const get = async (url, options) => {
  try {
    const token = await getSession();
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
    throw new Error(err);
  }
};

export const post = async (url, options) => {
  try {
    const token = await getSession();
    const json = await ky
      .post(url, {
        ...options,
        json: options.payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    throw new Error(err);
  }
};

export const put = async (url, options) => {
  try {
    const token = await getSession();
    const json = await ky
      .put(url, {
        ...options,
        json: options.payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();

    return json;
  } catch (err) {
    const { error } = await err.response.json();
    throw new Error(error || err);
  }
};

export const destroy = async (url, options) => {
  try {
    const token = await getSession();
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
    const { error } = await err.response.json();
    throw new Error(error || err);
  }
};

export default {
  get,
  post,
  put,
  destroy,
};
