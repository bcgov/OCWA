export const fetchToken = () => ({
  type: 'app/get/token',
});

export const toggleAbout = () => ({
  type: 'app/about/toggle',
});

export const versionsRequested = () => ({
  type: 'app/versions/requested',
});

export const versionsSuccess = payload => ({
  type: 'app/versions/success',
  payload,
});

export const versionsFailed = payload => ({
  type: 'app/versions/failed',
  error: true,
  payload,
});

export default {
  fetchToken,
  toggleAbout,
  versionsFailed,
  versionsRequested,
  versionsSuccess,
};
