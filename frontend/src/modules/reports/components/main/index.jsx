import * as React from 'react';
import PropTypes from 'prop-types';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Pagination from '@src/components/pagination';
import { RequestSchema } from '@src/modules/requests/types';
import { limit } from '@src/services/config';

import head from './head';
import makeRows from './rows';
import Empty from './empty';
import Filters from './filters';
import Projects from '../../containers/projects';
import * as styles from './styles.css';

function ReportsMain({
  data,
  endDate,
  fetchRequests,
  onSort,
  onDateChange,
  onRequestStateChange,
  onSelectRequester,
  onSelectProject,
  page,
  project,
  requester,
  requestState,
  sortOrder,
  sortKey,
  startDate,
}) {
  const rows = makeRows({
    data,
    onSelectProject,
    onSelectRequester,
  });
  const isPaginationVisible = data.length > 0;

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <header className={styles.header}>
            <h2>Projects</h2>
          </header>
          <div className={styles.projectsTable}>
            <Projects />
          </div>
          <header className={styles.header}>
            <h2>Requests</h2>
          </header>
          <Filters
            endDate={endDate}
            onDateChange={onDateChange}
            onRequestStateChange={onRequestStateChange}
            onSelectProject={onSelectProject}
            onSelectRequester={onSelectRequester}
            project={project}
            requester={requester}
            requestState={requestState}
            startDate={startDate}
          />
        </GridColumn>
      </Grid>
      <Grid>
        <GridColumn medium={12}>
          <div id="reports-list-table">
            <DynamicTableStateless
              emptyView={<Empty />}
              head={head}
              rows={rows}
              loadingSpinnerSize="large"
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSort={sortProps => onSort(sortProps)}
            />
            {isPaginationVisible && (
              <Pagination
                onClick={fetchRequests}
                isLastPage={data.length < limit * page}
                page={page}
              />
            )}
          </div>
          <footer>
            <small>
              * Date an output checker either approved or requested revisions
              for a request.
            </small>
          </footer>
        </GridColumn>
      </Grid>
    </Page>
  );
}

ReportsMain.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  fetchRequests: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  project: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  onRequestStateChange: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  onSelectRequester: PropTypes.func.isRequired,
  requester: PropTypes.string,
  requestState: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
};

ReportsMain.defaultProps = {
  project: null,
  requester: null,
};

export default ReportsMain;
