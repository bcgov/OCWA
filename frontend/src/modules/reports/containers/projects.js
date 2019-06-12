import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { fetchRequests } from '@src/modules/requests/actions';

import { setProject, sortReports } from '../actions';
import ProjectsTable from '../components/projects-table';

const mapStateToProps = state => {
  const {
    endDate,
    project,
    requester,
    requestState,
    sortKey,
    sortOrder,
    startDate,
  } = state.reports.filters;

  return {
    data: [
      {
        _id: 1,
        name: 'Project 1',
        firstOutputDate: new Date('January 11, 2019'),
        lastOutputDate: new Date('May 31, 2019'),
        requests: 45,
      },
      {
        _id: 2,
        name: 'Project 2',
        firstOutputDate: new Date('February 3, 2019'),
        lastOutputDate: new Date('June 11, 2019'),
        requests: 14,
      },
    ],
    endDate,
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.requests'),
    project,
    requester,
    requestState,
    sortKey,
    sortOrder,
    startDate,
    page: 1,
  };
};

export default connect(mapStateToProps, {
  onSelectProject: setProject,
  onSort: sortReports,
})(withRequest(ProjectsTable));
