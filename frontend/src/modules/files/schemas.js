import mapKeys from 'lodash/mapKeys';
import { schema } from 'normalizr';

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
};
