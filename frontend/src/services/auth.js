export const LS_AUTH_KEY = 'ocwa.token';

export const saveSession = token => {
  localStorage.setItem(LS_AUTH_KEY, token);
};

export const getSession = async () => {
  try {
    const token = localStorage.getItem(LS_AUTH_KEY);

    return token;
  } catch (err) {
    throw err;
  }
};

export const destroySession = () => {
  localStorage.setItem(LS_AUTH_KEY, '');
};
