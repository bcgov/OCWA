import { createDataAction } from '@src/modules/data/actions';

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

export const fetchRequestTypes = createDataAction('request-types/get');

export default {
  closeDownloads,
  fetchRequestTypes,
  openDownloads,
  sortRequests,
};
