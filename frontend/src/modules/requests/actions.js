import { createDataAction } from '@src/modules/data/actions';

export const fetchRequests = createDataAction('requests/get');
export const fetchRequest = createDataAction('request/get');
export const createRequest = createDataAction('request/post');
export const saveRequest = createDataAction('request/put');
export const deleteRequest = createDataAction('request/delete');
export const fetchFiles = createDataAction('files/get');

export const changeFilter = filter => ({
  type: 'requests/filter',
  payload: filter,
});

export const sortRequests = ({ key, sortOrder }) => ({
  type: 'requests/sort',
  payload: {
    sortKey: key,
    sortOrder,
  },
});

export const searchResults = filter => ({
  type: 'requests/search',
  payload: filter,
});

export const changeStep = step => ({
  type: 'requests/change-step',
  payload: step,
});

export const viewDraftRequest = id => ({
  type: 'requests/view/draft',
  payload: id,
});

export const closeDraftRequest = () => ({
  type: 'requests/close/draft',
});

// Request File Upload Actions
export const uploadFile = (file, requestId) => ({
  type: 'request/file/upload',
  meta: {
    requestId,
  },
  payload: file,
});

export const uploadFileProgress = (file, url, progress) => ({
  type: 'request/file/upload/progress',
  meta: {
    file,
    url,
  },
  payload: progress,
});

export const uploadFileFailure = (file, url, error) => ({
  type: 'request/file/upload/failed',
  meta: {
    file,
    url,
  },
  error: true,
  payload: error,
});

export const uploadFileSuccess = (file, url) => ({
  type: 'request/file/upload/success',
  meta: {
    url,
  },
  payload: file,
});

export default {
  createRequest,
  changeStep,
  closeDraftRequest,
  fetchRequests,
  saveRequest,
  sortRequests,
  viewDraftRequest,
};
