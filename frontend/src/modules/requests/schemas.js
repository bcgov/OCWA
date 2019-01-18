import mapKeys from 'lodash/mapKeys';
import { schema } from 'normalizr';

// NOTE: delete only works if a request is in WIP/Draft and has never been submitted

export const requestSchema = new schema.Entity(
  'requests',
  {},
  { idAttribute: '_id' }
);

export const requestsListSchema = new schema.Array(requestSchema);

export const fileSchema = new schema.Entity(
  'files',
  {},
  {
    processStrategy(entity) {
      return mapKeys(entity, (value, key) => {
        switch (key) {
          case 'contenttype':
            return 'contentType';
          case 'filetype':
            return 'fileType';
          case 'filename':
            return 'fileName';
          case 'lastmodified':
            return 'lastModified';
          default:
            return key;
        }
      });
    },
  }
);
export const filesListSchema = new schema.Array(fileSchema);

export default {
  fileSchema,
  filesListSchema,
  requestSchema,
  requestsListSchema,
};
