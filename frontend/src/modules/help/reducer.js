const initialState = {
  open: false,
};

function help(state = initialState, action = {}) {
  switch (action.type) {
    case 'help/toggle':
      return {
        ...state,
        open: !state.open,
      };

    default:
      return state;
  }
}

export default help;
