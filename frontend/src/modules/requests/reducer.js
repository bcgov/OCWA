import { combineReducers } from 'redux';
import get from 'lodash/get';
import mapKeys from 'lodash/mapKeys';
import uniqueId from 'lodash/uniqueId';
import union from 'lodash/union';

const uploadIdMapper = (action, value, key) => {
  if (action.meta.file.filename === value.filename) {
    return action.meta.file.id;
  }

  return key;
};

const initialViewState = {
  currentRequestId: null,
  currentNewRequestStep: 0,
  filter: null,
  filesToDelete: [],
  sortKey: 'state',
  sortOrder: 'DESC',
  search: '',
};

const viewState = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case 'requests/filter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'requests/sort':
      return {
        ...state,
        ...action.payload,
      };

    case 'requests/search':
      return {
        ...state,
        search: action.payload,
      };

    case 'requests/view/request':
    case 'requests/view/draft':
      return {
        ...state,
        currentRequestId: action.payload,
      };

    case 'request/reset':
    case 'request/close/draft':
      return {
        ...state,
        filesToDelete: [],
        currentRequestId: null,
        currentNewRequestStep: 0,
      };

    case 'requests/change-step':
      return {
        ...state,
        currentNewRequestStep: action.payload,
      };

    case 'request/put/success':
      return {
        ...state,
        filesToDelete: [],
        currentRequestId: action.meta.quitEditing
          ? null
          : state.currentRequestId,
        currentNewRequestStep: action.meta.nextStep
          ? 1
          : state.currentNewRequestStep,
      };

    case 'request/post/success':
      return {
        ...state,
        currentRequestId: action.meta.quitEditing
          ? null
          : get(action, 'payload.result.result', state.currentRequestId),
        currentNewRequestStep: action.meta.nextStep
          ? 1
          : state.currentNewRequestStep,
      };

    case 'request/remove-file':
      return {
        ...state,
        filesToDelete: union(state.filesToDelete, [action.payload]),
      };

    default:
      return state;
  }
};

const files = (state = {}, action = {}) => {
  if (action.type === 'request/file/upload') {
    // Normalize the file objects for the UI to match output from TUS
    if (!action.meta.isSupportingFile) {
      return action.payload.reduce(
        (prev, file) => ({
          ...prev,
          [uniqueId('file')]: {
            fileName: file.name,
            size: file.size,
            fileType: file.type,
            lastModified: file.lastModified,
          },
        }),
        state
      );
    }
  }

  if (
    /request\/file\/upload\/(failed|progress|success)$/.test(action.type) &&
    !action.meta.isSupportingFile
  ) {
    return mapKeys(state, uploadIdMapper.bind(null, action));
  }

  if (
    action.type === 'requests/close/draft' ||
    action.type === 'request/put/success'
  ) {
    return {};
  }

  return state;
};

const supportingFiles = (state = {}, action = {}) => {
  // Normalize the file objects for the UI to match output from TUS
  if (action.type === 'request/file/upload') {
    if (action.meta.isSupportingFile) {
      return action.payload.reduce(
        (prev, file) => ({
          ...prev,
          [uniqueId('supporting-file')]: {
            fileName: file.name,
            size: file.size,
            fileType: file.type,
            lastModified: file.lastModified,
          },
        }),
        state
      );
    }
  }

  if (
    /request\/file\/upload\/(failed|progress|success)$/.test(action.type) &&
    action.meta.isSupportingFile
  ) {
    return mapKeys(state, uploadIdMapper.bind(null, action));
  }

  if (
    action.type === 'requests/close/draft' ||
    action.type === 'request/put/success'
  ) {
    return {};
  }

  return state;
};

const uploads = (state = {}, action = {}) => {
  switch (action.type) {
    case 'request/file/upload/progress':
      return {
        ...state,
        [action.meta.file.id]: action.payload,
      };

    case 'request/file/upload/success':
      return {
        ...state,
        [action.payload.id]: 'loaded',
      };

    case 'request/file/upload/failed':
      return {
        ...state,
        [action.meta.file.id]: 'failed',
      };

    case 'request/put/success':
    case 'request/put/failed':
    case 'request/close/draft':
      return {};

    default:
      return state;
  }
};

export default combineReducers({
  files,
  supportingFiles,
  uploads,
  viewState,
});
