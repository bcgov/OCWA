import { combineReducers } from 'redux';
import union from 'lodash/union';
import get from 'lodash/get';

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

export default combineReducers({
  posts,
});
