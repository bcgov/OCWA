export const fetchGroups = () => ({
  type: 'app/get/groups',
});

export const fetchToken = group => ({
  type: 'app/get/token',
  payload: group,
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

export const selectProject = project => ({
  type: 'app/project-selected',
  payload: project,
});

export default {
  fetchGroups,
  fetchToken,
  toggleAbout,
  selectProject,
  versionsFailed,
  versionsRequested,
  versionsSuccess,
};
