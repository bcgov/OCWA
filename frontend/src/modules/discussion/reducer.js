import { combineReducers } from 'redux';
import get from 'lodash/get';
import union from 'lodash/union';
import uniqueId from 'lodash/uniqueId';

const initialPostsState = {};

function posts(state = initialPostsState, action = {}) {
  switch (action.type) {
    case 'discussion/post/received':
    case 'discussion/posts/post/success':
      return {
        ...state,
        [action.meta.topicId]: union(get(state, action.meta.topicId, []), [
          action.payload.result.result,
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

// Add temp messages incase of latency
function newPost(state = {}, action = {}) {
  switch (action.type) {
    case 'discussion/posts/post/requested':
      return {
        _id: uniqueId('post'),
        isSaving: true,
        comment: action.meta.comment,
        createdTs: new Date().toString(),
        authorUser: '-',
      };

    case 'discussion/posts/post/success':
      return {};

    default:
      return state;
  }
}

export default combineReducers({
  posts,
  newPost,
});
