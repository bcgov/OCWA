export const fetchToken = () => ({
  type: 'app/get/token',
});

export const toggleReportError = () => ({
  type: 'app/report-error/toggle',
});

export const reportError = (payload, componentStack) => ({
  type: 'user/report-error',
  error: true,
  meta: {
    componentStack,
  },
  payload,
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

export const initSockets = () => ({
  type: 'sockets/init',
});

export default {
  fetchToken,
  initSockets,
  toggleAbout,
  versionsFailed,
  versionsRequested,
  versionsSuccess,
};
