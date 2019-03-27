import omit from 'lodash/omit';

const initialState = {};

function uploadStatus(state = initialState, action = {}) {
  switch (action.type) {
    case 'file/upload/progress':
      return {
        ...state,
        [action.meta.file.id]: action.payload,
      };

    case 'file/upload/success':
      return {
        ...state,
        [action.meta.file.id]: 'uploaded',
      };

    case 'file/upload/failed':
      return {
        ...state,
        [action.meta.file.id]: 'failed',
      };

    case 'request/remove-file':
      return omit(state, action.payload);

    default:
      return state;
  }
}

export default uploadStatus;
