import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';
import { getRequestStateText } from '@src/modules/requests/utils';

import { sortReports } from '../actions';
import { fetchRequests } from '../../requests/actions';
import { requestsListSchema } from '../../requests/schemas';
import Reports from '../components/main';

const mapStateToProps = state => {
  const { sortKey, sortOrder } = state.reports.filters;
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const data = ids.map(id => get(entities, id, {}));
  const chartData = [];
  const dataByState = groupBy(data, 'state');

  forIn(dataByState, (value, key) => {
    chartData.push({
      angle: value.length,
      label: getRequestStateText(Number(key)),
    });
  });

  return {
    chartData,
    data,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    sortKey,
    sortOrder,
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
})(withRequest(Reports));
