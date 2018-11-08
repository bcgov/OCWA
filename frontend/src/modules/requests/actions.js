import { createDataAction } from '@src/modules/data/actions';

export const fetchRequests = createDataAction('requests/get');
export const fetchRequest = createDataAction('request/get');
export const createRequest = createDataAction('requests/post');
export const saveRequest = createDataAction('requests/put');

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

export default {
  createRequest,
  changeStep,
  closeDraftRequest,
  fetchRequests,
  saveRequest,
  viewDraftRequest,
};
