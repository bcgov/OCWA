import { createDataAction } from '@src/modules/data/actions';

export const initSocket = () => ({
  type: 'discussion/socket/init',
});

export const fetchPosts = createDataAction('discussion/posts/get');

export const createPost = createDataAction('discussion/posts/post');

export default {
  createPost,
  fetchPosts,
  initSocket,
};
