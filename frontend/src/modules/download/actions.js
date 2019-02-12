export const openDownloads = requestId => ({
  type: 'downloads/open',
  payload: requestId,
});

export const closeDownloads = () => ({
  type: 'downloads/close',
});

export const sortRequests = ({ key, sortOrder }) => ({
  type: 'downloads/requests/sort',
  payload: {
    sortKey: key,
    sortOrder,
  },
});

export default {
  closeDownloads,
  openDownloads,
  sortRequests,
};
