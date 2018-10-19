import { schema } from 'normalizr';

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
