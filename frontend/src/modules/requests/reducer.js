import { combineReducers } from 'redux';

const viewState = (state = {}, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  viewState,
});
