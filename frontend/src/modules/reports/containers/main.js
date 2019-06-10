import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import isWithinRange from 'date-fns/is_within_range';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';
import { getRequestStateColor } from '@src/modules/requests/utils';

import {
  setDateRange,
  setDateFilter,
  setRequestFilter,
  sortReports,
} from '../actions';
import Reports from '../components/main';
import { makeRequest } from './selectors';

const mapStateToProps = state => {
  const {
    endDate,
    sortKey,
    requestState,
    sortOrder,
    startDate,
  } = state.reports.filters;
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const data = ids
    .map(id => get(entities, id, {}))
    .filter(
      d =>
        d.chronology.some(c => c.enteredState > 2) &&
        (requestState === 'all' || d.state === requestState)
    )
    .map(makeRequest);

  const chartData = data.map((d, index) => ({
    x: new Date(d.firstSubmittedDate).getTime(),
    x0:
      new Date(d.approvedDate).getTime() || new Date(d.lastEditDate).getTime(),
    y: index,
    y0: index + 1,
    color: getRequestStateColor(d.state),
  }));

  return {
    chartData,
    data,
    endDate,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    requestState,
    sortKey,
    sortOrder,
    startDate,
    page: 1,
  };
};

export default connect(mapStateToProps, {
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
  onSort: sortReports,
  onDateChange: setDateFilter,
  onDateRangeChange: setDateRange,
  onRequestStateChange: setRequestFilter,
})(withRequest(Reports));
