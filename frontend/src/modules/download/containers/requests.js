import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { requestsListSchema } from '@src/modules/requests/schemas';
import { limit } from '@src/services/config';
import { fetchRequests } from '@src/modules/requests/actions';

import { sortRequests } from '../actions';
import Requests from '../components/requests';

const mapStateToProps = state => {
  const { page, search, sortKey, sortOrder } = state.download.viewState;
  const { ids } = state.download;
  const entities = get(state, 'data.entities.requests', {});
  const regex = new RegExp(search, 'i');
  const sliceStartIndex = Math.max((page - 1) * limit, 0);
  const dataEntities = ids.map(id => get(entities, id, {}));

  const data = dataEntities.filter(d => d.state === 4).filter(d => {
    if (!search) return true;
    return regex.test(d.name);
  });

  return {
    data: search ? data : data.slice(sliceStartIndex, sliceStartIndex + limit),
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    page,
    search,
    sortKey,
    sortOrder,
  };
};

export default connect(mapStateToProps, {
  onSort: sortRequests,
  initialRequest: () =>
    fetchRequests(
      { page: 1 },
      { state: 4 },
      {
        url: '/api/v1/requests?page=1&state=4',
        schema: requestsListSchema,
      }
    ),
})(withRequest(Requests));
