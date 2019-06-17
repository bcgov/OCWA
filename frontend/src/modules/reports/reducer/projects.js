const initialState = {
  sortKey: 'lastOutputDate',
  sortOrder: 'DESC',
};

function projects(state = initialState, action = {}) {
  switch (action.type) {
    case 'projects/sort':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export default projects;
