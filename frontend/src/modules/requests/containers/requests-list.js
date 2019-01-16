import { connect } from 'react-redux';
import get from 'lodash/get';
import keys from 'lodash/keys';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import withRequest from '@src/modules/data/components/data-request';
import { limit } from '@src/services/config';

import {
  changeFilter,
  fetchRequests,
  searchResults,
  sortRequests,
  viewDraftRequest,
} from '../actions';
import RequestsList from '../components/requests-list';
import { requestsListSchema } from '../schemas';

const mapStateToProps = state => {
  const { filter, page, search, sortKey, sortOrder } = state.requests.viewState;
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const regex = new RegExp(search, 'i');
  const sliceStartIndex = page === 1 ? 0 : page * limit;
  const dataEntities = ids
    .map(id => get(entities, id, {}))
    .filter(d => {
      if (isNull(filter)) return true;
      if (isArray(filter)) return filter.includes(d.state);
      return d.state === filter;
    })
    .slice(sliceStartIndex, sliceStartIndex + limit);

  const data = dataEntities.filter(d => {
    if (!search) return true;
    return regex.test(d.name);
  });

  return {
    data,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    filter,
    page,
    search,
    sortKey,
    sortOrder,
  };
};

export default connect(mapStateToProps, {
  onChangeFilter: changeFilter,
  onSearch: searchResults,
  onSelect: viewDraftRequest,
  onSort: sortRequests,
  initialRequest: () =>
    fetchRequests(
      { page: 1 },
      {
        url: '/api/v1/requests?page=1',
        schema: requestsListSchema,
      }
    ),
  fetchRequests: page =>
    fetchRequests(
      { page },
      {
        url: `/api/v1/requests?page=${page}`,
        schema: requestsListSchema,
      }
    ),
})(withRequest(RequestsList));
