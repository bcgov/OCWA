import get from 'lodash/get';

let session = null;

export const saveSession = payload => {
  if (!payload) {
    throw new Error('No JWT payload');
  }

  session = payload;
};

export const getSession = () => {
  if (!session) {
    throw new Error('Session expired');
  }

  return session;
};

export const getToken = () => get(session, 'token', null);

export const getRefreshToken = () => get(session, 'refreshToken', null);

export const destroySession = () => {
  session = null;
};
