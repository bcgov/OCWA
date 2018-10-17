import ky from 'ky';
import { camelizeKeys } from 'humps';

import { getSession } from './auth';

export const get = async (url, options) => {
  try {
    const token = await getSession();
    const json = await ky(url, {
      ...options,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).json();

    return camelizeKeys(json);
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  get,
};
