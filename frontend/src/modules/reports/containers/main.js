import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import withRequest from '@src/modules/data/components/data-request';
import { getRequestStateText } from '@src/modules/requests/utils';

import { sortReports } from '../actions';
import { fetchRequests } from '../../requests/actions';
import { requestsListSchema } from '../../requests/schemas';
import Reports from '../components/main';

const getAdjudicationDate = request => {
  const change = request.chronology.find(c => c.enteredState > 3);
  if (change) {
    return change.timestamp;
  }

  return '';
};

const mapStateToProps = state => {
  const { sortKey, sortOrder } = state.reports.filters;
  const entities = get(state, 'data.entities.requests', {});
  const ids = keys(entities);
  const data = ids.map(id => {
    const request = get(entities, id, {});
    const submittedOn = head(request.chronology).timestamp;
    const updatedOn = last(request.chronology).timestamp;
    const outputChecker = head(request.reviewers);
    const adjudicationDate = getAdjudicationDate(request);

    return {
      ...request,
      submittedOn,
      updatedOn,
      outputChecker,
      adjudicationDate,
    };
  });

  const chartData = [];
  const dataByState = groupBy(data, 'adjudicationDate');

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
