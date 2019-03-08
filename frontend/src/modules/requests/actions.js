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

export const clearSearch = () => ({
  type: 'requests/search/clear',
});

export const changeStep = step => ({
  type: 'requests/change-step',
  payload: step,
});

export const viewDraftRequest = id => ({
  type: 'requests/view/draft',
  payload: id,
});

export const duplicateRequest = request => ({
  type: 'requests/duplicate',
  payload: request,
});

export const editRequest = request => ({
  type: 'requests/view/request',
  payload: request,
});

export const closeDraftRequest = () => ({
  type: 'request/close/draft',
});

// Request File Upload Actions
export const uploadFile = (file, requestId) => ({
  type: 'request/file/upload',
  meta: {
    requestId,
  },
  payload: file,
});

// Same as above, but with some extra flags for separate upload features.
export const uploadSupportingFile = (file, requestId) => ({
  type: 'request/file/upload',
  meta: {
    requestId,
    isSupportingFile: true,
  },
  payload: file,
});

export const uploadFileProgress = (meta, progress) => ({
  type: 'request/file/upload/progress',
  meta,
  payload: progress,
});

export const uploadFileFailure = (meta, error) => ({
  type: 'request/file/upload/failed',
  meta,
  error: true,
  payload: error,
});

export const uploadFileSuccess = (meta, payload) => ({
  type: 'request/file/upload/success',
  meta,
  payload,
});

export const uploadFileReset = id => ({
  type: 'request/file/upload/reset',
  payload: id,
});

export const reset = () => ({ type: 'request/reset' });

export const removeFile = id => ({ type: 'request/remove-file', payload: id });

export const toggleMyRequests = () => ({ type: 'requests/toggle-my-requests' });

export default {
  createRequest,
  changeStep,
  clearSearch,
  closeDraftRequest,
  duplicateRequest,
  fetchRequests,
  removeFile,
  reset,
  saveRequest,
  sortRequests,
  toggleMyRequests,
  uploadSupportingFile,
  uploadFile,
  uploadFileReset,
  viewDraftRequest,
};
