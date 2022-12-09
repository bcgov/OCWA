import { createDataAction } from '@src/modules/data/actions';

export const openDownloads = requestId => ({
  type: 'downloads/open',
  payload: requestId,
});

export const closeDownloads = () => ({
  type: 'downloads/close',
});

export const sortRequests = ({ key, sortOrder, page = 1 }) => ({
  type: 'downloads/requests/sort',
  payload: {
    sortKey: key,
    sortOrder,
    page
  },
});

export const fetchRequestTypes = createDataAction('request-types/get');

export default {
  closeDownloads,
  fetchRequestTypes,
  openDownloads,
  sortRequests,
};
