import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import isWithinRange from 'date-fns/is_within_range';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';

import {
  setDateRange,
  setDateFilter,
  setRequestFilter,
  sortReports,
} from '../actions';
import { fetchRequests } from '../../requests/actions';
import { requestsListSchema } from '../../requests/schemas';
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
      d => d.state > 2 && (requestState === 'all' || d.state === requestState)
    )
    .map(makeRequest)
    .filter(d => isWithinRange(d.lastEditDate, startDate, endDate));

  const chartData = [];
  const dataByState = groupBy(
    data.filter(d => !isEmpty(d.lastEditDate)),
    'lastEditDate'
  );

  forIn(dataByState, (value, key) => {
    if (key) {
      chartData.push({
        y: value.length,
        x: new Date(key).getTime(),
      });
    }
  });

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
