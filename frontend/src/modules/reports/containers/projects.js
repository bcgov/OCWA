import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

// import { fetchProjects } from '../actions';
// import { projects } from '../schemas'

import { setProject, sortProjects } from '../actions';
import ProjectsTable from '../components/projects-table';

const mapStateToProps = state => {
  const { sortKey, sortOrder } = state.reports.projects;

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
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.projects', 'idle'),
    sortKey,
    sortOrder,
  };
};

export default connect(mapStateToProps, {
  // initialRequest: () =>
  //   fetchProjects({
  //     url: '/api/v1/projects',
  //     schema: projectsSchema,
  //   }),
  onSelectProject: setProject,
  onSort: sortProjects,
})(withRequest(ProjectsTable));
