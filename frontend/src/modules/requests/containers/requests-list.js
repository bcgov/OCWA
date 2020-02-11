import { connect } from 'react-redux';
import escapeRegExp from 'lodash/escapeRegExp';
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
  toggleMyRequests,
  viewDraftRequest,
} from '../actions';
import RequestsList from '../components/requests-list';
import { requestsListSchema } from '../schemas';

const mapStateToProps = state => {
  const {
    filter,
    page,
    search,
    showMyRequestsOnly,
    sortKey,
    sortOrder,
  } = state.requests.viewState;
  const userId = get(state, 'app.auth.user.id');
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const regex = new RegExp(escapeRegExp(search), 'i');
  const sliceStartIndex = Math.max((page - 1) * limit, 0);
  const dataEntities = ids
    .map(id => get(entities, id, {}))
    .filter(d => {
      if (isNull(filter)) return true;
      if (isArray(filter)) return filter.includes(d.state);
      return d.state === filter;
    });

  const data = dataEntities
    .filter(d => {
      if (showMyRequestsOnly) {
        return d.author === userId;
      }
      return true;
    })
    .filter(d => {
      if (!search) return true;
      return regex.test(d.name);
    });

  return {
    data: search ? data : data.slice(sliceStartIndex, sliceStartIndex + limit),
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    filter,
    page,
    search,
    showMyRequestsOnly,
    sortKey,
    sortOrder,
  };
};

export default connect(
  mapStateToProps,
  {
    onChangeFilter: changeFilter,
    onSearch: searchResults,
    onSelect: viewDraftRequest,
    onShowMyRequests: toggleMyRequests,
    onSort: sortRequests,
    initialRequest: () =>
      fetchRequests(
        { page: 1 },
        {
          url: '/api/v2/requests?page=1',
          schema: requestsListSchema,
        }
      ),
    fetchRequests: page =>
      fetchRequests(
        { page },
        {
          url: `/api/v2/requests?page=${page}`,
          schema: requestsListSchema,
        }
      ),
  }
)(withRequest(RequestsList));
