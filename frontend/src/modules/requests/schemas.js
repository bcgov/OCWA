import { schema } from 'normalizr';

// NOTE: delete only works if a request is in WIP/Draft and has never been submitted

export const requestSchema = new schema.Entity(
  'requests',
  {},
  { idAttribute: '_id' }
);

export const requestsListSchema = new schema.Array(requestSchema);

export default {
  requestSchema,
  requestsListSchema,
};
