import { combineReducers } from 'redux';
import merge from 'lodash/merge';

const initialPostsState = {};

function posts(state = initialPostsState, action = {}) {
  switch (action.type) {
    case 'discussion/posts/get/success':
      return merge({}, state, {
        [action.meta.topicId]: action.payload.result,
      });

    default:
      return state;
  }
}

export default combineReducers({
  posts,
});
