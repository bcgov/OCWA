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
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.projects', 'idle'),
    sortKey,
    sortOrder,
  };
};

export default connect(
  mapStateToProps,
  {
    // initialRequest: () =>
    //   fetchProjects({
    //     url: '/api/v1/projects',
    //     schema: projectsSchema,
    //   }),
    onSelectProject: setProject,
    onSort: sortProjects,
  }
)(withRequest(ProjectsTable));
