import { connect } from 'react-redux';
import escapeRegExp from 'lodash/escapeRegExp';
import format from 'date-fns/format';
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
  const {
    filter,
    search,
    startDate,
    endDate,
    page,
  } = state.outputChecker.viewState;
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
    params: {
      startDate,
      endDate,
      state: params.state,
    },
    data: sortBy(data, [d => last(d.chronology).timestamp]),
    page: page[params.state],
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
  };
};

const makeQuery = ({ startDate, endDate, page = 1, state = 2 }) =>
  `/api/v2/requests?page=${page}&start_date=${format(
    startDate,
    'YYYY-M-D'
  )}&end_date=${format(endDate, 'YYYY-M-D')}&state=${state}&limit=100`;

export default connect(mapStateToProps, {
  initialRequest: params =>
    fetchRequests(
      { page: 1 },
      {
        url: makeQuery(params),
        schema: requestsListSchema,
      }
    ),
  fetchRequests: params =>
    fetchRequests(
      { page: params.page },
      {
        url: makeQuery(params),
        schema: requestsListSchema,
      }
    ),
})(withRequest(RequestsList));
