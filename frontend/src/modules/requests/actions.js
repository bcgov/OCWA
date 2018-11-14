import { createDataAction } from '@src/modules/data/actions';

export const fetchRequests = createDataAction('requests/get');
export const fetchRequest = createDataAction('request/get');
export const createRequest = createDataAction('request/post');
export const saveRequest = createDataAction('request/put');

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

export const uploadFile = (file, requestId) => ({
  type: 'request/file/upload',
  meta: {
    requestId,
  },
  payload: file,
});

export const uploadFileProgress = (file, progress) => ({
  type: 'request/file/upload/progress',
  meta: {
    file,
  },
  payload: progress,
});

export const uploadFileFailure = (file, error) => ({
  type: 'request/file/upload/failed',
  meta: {
    file,
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
  viewDraftRequest,
};
