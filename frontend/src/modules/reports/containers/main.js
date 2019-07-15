import { connect } from 'react-redux';
import forIn from 'lodash/forIn';
import format from 'date-fns/format';
import get from 'lodash/get';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';
import { requestsListSchema } from '@src/modules/requests/schemas';

import {
  setDateRange,
  setDateFilter,
  setRequestFilter,
  setProject,
  setRequester,
  sortReports,
} from '../actions';
import Reports from '../components/main';
import { makeRequest } from './selectors';

const mapStateToProps = state => {
  const {
    endDate,
    project,
    requester,
    requestIds,
    requestState,
    sortKey,
    sortOrder,
    startDate,
  } = state.reports.filters;
  const entities = get(state, 'data.entities.requests', {});
  const data = requestIds
    .map(id => get(entities, id, {}))
    .map(makeRequest) // TODO: Consider moving this back down after this step, the project value is stubbed in right now
    .filter(d => {
      if (requester && requester !== d.author) {
        return false;
      }

      if (project && !d.projects.includes(project)) {
        return false;
      }

      return (
        d.chronology.some(c => c.enteredState > 2) &&
        (requestState === 'all' || d.state === requestState)
      );
    })
    .filter(
      d =>
        isAfter(d.firstSubmittedDate, startDate) &&
        isBefore(d.lastEditDate, endDate)
    );
  // Reduce all the request projects to a key/value store before converting to an array
  const projectsData = data.reduce((prev, d) => {
    d.projects.forEach(p => {
      if (prev[p]) {
        prev[p].totalRequests += 1;
      } else {
        prev[p] = {
          id: p,
          name: p,
          totalRequests: 1,
        };
      }
    });

    return prev;
  }, {});
  const projects = [];
  forIn(projectsData, value => {
    projects.push(value);
  });

  return {
    data,
    params: {
      startDate: format(startDate, 'YYYY-M-D'),
      endDate: format(endDate, 'YYYY-M-D'),
    },
    projects,
    endDate,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests', 'idle'),
    project,
    requester,
    requestState,
    sortKey,
    sortOrder,
    startDate,
    page: 1,
  };
};

const makeQuery = (startDate, endDate) =>
  `/api/v1/requests?page=1&start_date=${format(
    startDate,
    'YYYY-M-D'
  )}&end_date=${format(endDate, 'YYYY-M-D')}&limit=500`;

export default connect(
  mapStateToProps,
  {
    initialRequest: params =>
      fetchRequests(
        {},
        {
          url: makeQuery(params.startDate, params.endDate),
          schema: requestsListSchema,
        }
      ),
    fetchRequests: ({ startDate, endDate }) =>
      fetchRequests(
        {
          startDate,
          endDate,
        },
        {
          url: makeQuery(startDate, endDate),
          schema: requestsListSchema,
        }
      ),
    onSelectProject: setProject,
    onSort: sortReports,
    onSelectRequester: setRequester,
    onDateChange: setDateFilter,
    onDateRangeChange: setDateRange,
    onRequestStateChange: setRequestFilter,
  }
)(withRequest(Reports));
