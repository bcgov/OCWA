import mapKeys from 'lodash/mapKeys';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

const uploadIdMapper = (action, value, key) => {
  if (action.meta.file.fileName === value.fileName) {
    return action.meta.file.id;
  }

  return key;
};

const initialState = {};

function entities(state = initialState, action = {}) {
  switch (action.type) {
    case 'file/upload':
      // Normalize the file objects for the UI to match output from TUS
      return action.payload.reduce(
        (prev, file) => ({
          ...prev,
          [uniqueId('file')]: {
            fileName: file.name,
            size: file.size,
            fileType: file.type,
            lastModified: file.lastModified,
            filesKey: action.meta.filesKey,
          },
        }),
        state
      );

    case 'file/upload/progress':
      return mapKeys(state, uploadIdMapper.bind(null, action));

    case 'request/put/success':
      return {};

    case 'request/remove-file':
      return omit(state, action.payload);

    default:
      return state;
  }
}

export default entities;
