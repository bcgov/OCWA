import { createDataAction } from '@src/modules/data/actions';

export const fetchPosts = createDataAction('discussion/posts/get');

export const createPost = createDataAction('discussion/posts/post');

export default {
  fetchPosts,
  createPost,
};
