import { schema } from 'normalizr';

export const postSchema = new schema.Entity(
  'posts',
  {},
  {
    idAttribute: '_id',
  }
);

export const postsListSchema = new schema.Array(postSchema);

export default {
  postSchema,
  postsListSchema,
};
