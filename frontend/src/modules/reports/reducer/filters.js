const initialState = {
  sortKey: 'submittedOn',
  sortOrder: 'DESC',
};

function filters(state = initialState, action = {}) {
  switch (action.type) {
    case 'reports/sort':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export default filters;
