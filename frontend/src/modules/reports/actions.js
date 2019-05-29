export const sortReports = ({ key, sortOrder }) => ({
  type: 'reports/sort',
  payload: {
    sortKey: key,
    sortOrder,
  },
});

export default {
  sortReports,
};
