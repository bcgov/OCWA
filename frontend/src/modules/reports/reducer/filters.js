import addMonths from 'date-fns/add_months';

const initialState = {
  sortKey: 'approvedDate',
  sortOrder: 'DESC',
  startDate: addMonths(new Date(), -4),
  endDate: new Date(),
  requestState: 'all',
  requester: null,
  project: null,
};

function filters(state = initialState, action = {}) {
  switch (action.type) {
    case 'reports/sort':
      return {
        ...state,
        ...action.payload,
      };

    case 'reports/filter-date':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case 'reports/filter-date-range':
      return {
        ...state,
        ...action.payload,
      };

    case 'reports/filter-requester':
      return {
        ...state,
        requester: action.payload,
      };

    case 'reports/filter-project':
      return {
        ...state,
        project: action.payload,
      };

    case 'reports/filter-state':
      return {
        ...state,
        requestState: action.payload,
      };

    default:
      return state;
  }
}

export default filters;
