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
  changeStep,
  viewDraftRequest,
};
