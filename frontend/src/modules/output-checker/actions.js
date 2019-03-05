import { createDataAction } from '@src/modules/data/actions';

export const approveRequest = createDataAction('request/put');
export const denyRequest = createDataAction('request/put');
export const pickupRequest = createDataAction('request/put');
export const requestRevisions = createDataAction('request/put');

export const changeFilter = value => ({
  type: 'requests/filter/changed',
  payload: value,
});

export const changeStateFilter = value => ({
  type: 'requests/state/changed',
  payload: value,
});

export const search = value => ({
  type: 'requests/search',
  payload: value,
});

export const navSearch = value => ({
  type: 'request/nav/search',
  payload: value,
});

export default {
  changeFilter,
  changeStateFilter,
  search,
  pickupRequest,
};
