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

export const reset = () => ({ type: 'request/reset' });

export const finishEditing = id => ({
  type: 'request/finish-editing',
  payload: id,
});

export const removeFile = (id, filesKey) => ({
  type: 'request/remove-file',
  meta: { filesKey },
  payload: id,
});

export const toggleMyRequests = () => ({ type: 'requests/toggle-my-requests' });

export default {
  createRequest,
  changeStep,
  clearSearch,
  closeDraftRequest,
  duplicateRequest,
  fetchRequests,
  finishEditing,
  removeFile,
  reset,
  saveRequest,
  sortRequests,
  toggleMyRequests,
  viewDraftRequest,
};
