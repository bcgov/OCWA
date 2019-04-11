// This reducer just tracks which ID's belong to which type of upload (output or supporting)
// Adding id's on success allows easy tracking of the new values
import union from 'lodash/union';
import get from 'lodash/get';

const initialState = {
  files: [],
  supportingFiles: [],
};

function fileTypes(state = initialState, action = {}) {
  const filesKey = get(action, 'meta.filesKey');
  const values = get(state, filesKey, []);

  if (action.type === 'file/upload/success') {
    // fileType can only be one of the keys in the initialState
    return {
      ...state,
      [filesKey]: union(values, [action.meta.file.id]),
    };
  }

  if (action.type === 'request/remove-file') {
    return {
      ...state,
      [filesKey]: values.filter(id => id !== action.payload),
    };
  }

  return state;
}

export default fileTypes;
