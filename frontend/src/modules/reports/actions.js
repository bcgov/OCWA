export const sortReports = ({ key, sortOrder }) => ({
  type: 'reports/sort',
  payload: {
    sortKey: key,
    sortOrder,
  },
});

export const setDateFilter = (key, value) => ({
  type: 'reports/filter-date',
  payload: {
    key,
    value,
  },
});

export const setRequestFilter = value => ({
  type: 'reports/filter-state',
  payload: value,
});

export const setRequester = value => ({
  type: 'reports/filter-requester',
  payload: value,
});

export const setProject = value => ({
  type: 'reports/filter-project',
  payload: value,
});

export const setDateRange = ({ left, right }) => ({
  type: 'reports/filter-date-range',
  payload: {
    startDate: left,
    endDate: right,
  },
});

export default {
  setDateFilter,
  setDateRange,
  setProject,
  setRequester,
  setRequestFilter,
  sortReports,
};
