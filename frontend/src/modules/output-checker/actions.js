import { createDataAction } from '@src/modules/data/actions';

export const approveRequest = createDataAction('request/put');
export const denyRequest = createDataAction('request/put');
export const pickupRequest = createDataAction('request/put');
export const requestRevisions = createDataAction('request/put');

export default {
  pickupRequest,
};
