import * as React from 'react';
import PropTypes from 'prop-types';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import Empty from './empty';
import head from './head';
import makeRows from './rows';

function ProjectsTable({ data, onSelectProject, onSort, sortKey, sortOrder }) {
  const rows = makeRows({
    data,
    onSelectProject,
  });
  return (
    <DynamicTableStateless
      emptyView={<Empty />}
      head={head}
      rows={rows}
      loadingSpinnerSize="large"
      sortKey={sortKey}
      sortOrder={sortOrder}
      onSort={sortProps => onSort(sortProps)}
    />
  );
}

ProjectsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ).isRequired,
  onSort: PropTypes.func.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
};

export default ProjectsTable;
