import { connect } from 'react-redux';
import get from 'lodash/get';
import keys from 'lodash/keys';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import withRequest from '@src/modules/data/components/data-request';

import {
  changeFilter,
  fetchRequests,
  searchResults,
  viewDraftRequest,
} from '../actions';
import RequestsList from '../components/requests-list';
import { requestsListSchema } from '../schemas';

const mapStateToProps = state => {
  const { filter, search } = state.requests.viewState;
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const regex = new RegExp(search, 'i');
  const data = ids
    .map(id => get(entities, id, {}))
    .filter(d => {
      if (isNull(filter)) return true;
      if (isArray(filter)) return filter.includes(d.state);
      return d.state === filter;
    })
    .filter(d => {
      if (!search) return true;
      return regex.test(d.name);
    });

  return {
    data,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    filter,
    search,
  };
};

export default connect(mapStateToProps, {
  onChangeFilter: changeFilter,
  onSearch: searchResults,
  onSelect: viewDraftRequest,
  initialRequest: () =>
    fetchRequests({
      url: '/api/v1/requests',
      schema: requestsListSchema,
    }),
})(withRequest(RequestsList));
