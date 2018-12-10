import { combineReducers } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import union from 'lodash/union';

const initialPostsState = {};

function posts(state = initialPostsState, action = {}) {
  switch (action.type) {
    case 'discussion/post/received':
    case 'discussion/posts/post/success':
      return {
        ...state,
        [action.meta.topicId]: union(get(state, action.meta.topicId, []), [
          action.payload.result,
        ]),
      };

    case 'discussion/posts/get/success':
      return {
        ...state,
        [action.meta.topicId]: union(
          get(state, action.meta.topicId, []),
          action.payload.result
        ),
      };

    default:
      return state;
  }
}

// Add temp messages
function newPosts(state = {}, action = {}) {
  switch (action.type) {
    case 'discussion/posts/post/success':
      return has(state, action.payload.result)
        ? omit(state, action.payload.result)
        : merge({}, state, action.payload.entities.posts, {
            [action.payload.result]: {
              comment: action.meta.comment,
              createdTs: new Date().toString(),
              authorUser: '...',
            },
          });

    default:
      return state;
  }
}

export default combineReducers({
  posts,
  newPosts,
});
