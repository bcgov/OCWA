import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';

const initialState = {
  sortKey: 'lastEditDate',
  sortOrder: 'DESC',
  startDate: addMonths(new Date(), -4),
  endDate: addDays(new Date(), 1),
  requestState: 'all',
  requestIds: [],
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

    case 'requests/get':
      return {
        ...state,
        ...action.payload,
      };

    case 'requests/get/success':
      return {
        ...state,
        requestIds: action.payload.result,
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
