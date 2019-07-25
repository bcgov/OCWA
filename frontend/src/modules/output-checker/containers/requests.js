import { connect } from 'react-redux';
import escapeRegExp from 'lodash/escapeRegExp';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';

import RequestsList from '../components/requests-list';

const mapStateToProps = (state, { params }) => {
  const { filter, search } = state.outputChecker.viewState;
  const username = get(state, 'app.auth.user.id');
  const requests = values(state.data.entities.requests);
  const data = requests
    .filter(d => d.state === params.state)
    .filter(d => {
      switch (filter) {
        case 'mine':
          return head(d.reviewers) === username;
        case 'unassigned':
          return d.reviewers.length === 0;
        default:
          return true;
      }
    })
    .filter(d => (search ? d.name.search(escapeRegExp(search)) >= 0 : true));

  return {
    data: sortBy(data, d => last(d.chronology).timestamp).reverse(),
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
  };
};

export default connect(
  mapStateToProps,
  {
    initialRequest: ({ state }) =>
      fetchRequests(
        { page: 1 },
        {
          url: `/api/v1/requests?page=1&state=${state}`,
          schema: requestsListSchema,
        },
      ),
  },
)(withRequest(RequestsList));
