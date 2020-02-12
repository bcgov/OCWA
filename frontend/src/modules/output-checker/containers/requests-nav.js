import { connect } from 'react-redux';
import get from 'lodash/get';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';

import { navSearch } from '../actions';
import RequestNav from '../components/request/nav';

const mapStateToProps = state => {
  const ids = keys(state.data.entities.requests);
  const search = state.outputChecker.viewState.navSearch;
  const regex = new RegExp(search, 'i');
  const data = ids
    .map(id => state.data.entities.requests[id])
    .filter(d => d.state === state.outputChecker.viewState.state)
    .filter(d => (search ? regex.test(d.name) : true));

  return {
    data,
    filter: state.outputChecker.viewState.filter,
    state: state.outputChecker.viewState.state,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests', 'idle'),
  };
};

export default connect(mapStateToProps, {
  onSearch: navSearch,
  initialRequest: () =>
    fetchRequests(
      { page: 1 },
      {
        url: '/api/v2/requests?page=1&state=3',
        schema: requestsListSchema,
      }
    ),
  onStateFilterChange: state =>
    fetchRequests(
      {
        page: 1,
        state,
      },
      {
        url: `/api/v2/requests?page=1&state=${state}`,
        schema: requestsListSchema,
      }
    ),
})(withRequest(RequestNav));
