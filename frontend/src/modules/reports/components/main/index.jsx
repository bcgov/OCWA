import * as React from 'react';
import PropTypes from 'prop-types';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import format from 'date-fns/format';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { RequestSchema } from '@src/modules/requests/types';

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
  fetchStatus,
  onSort,
  onRequestStateChange,
  onSelectRequester,
  onSelectProject,
  project,
  projects,
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
  const titleDateFormat = 'MMM Do, YYYY';

  return (
    <div className={styles.container}>
      <Page>
        <Grid layout="fluid">
          <GridColumn medium={12}>
            <header className={styles.header}>
              <h2>
                Dashboard
                <small>{`Filtering from ${format(
                  startDate,
                  titleDateFormat
                )} to ${format(endDate, titleDateFormat)}`}</small>
              </h2>
            </header>
            <Filters
              endDate={endDate}
              onDateChange={fetchRequests}
              onRequestStateChange={onRequestStateChange}
              onSelectProject={onSelectProject}
              onSelectRequester={onSelectRequester}
              project={project}
              requester={requester}
              requestState={requestState}
              startDate={startDate}
            />
            <div className={styles.projectsTable}>
              <header className={styles.header}>
                <h2>
                  Projects <small>{`${projects.length} Available`}</small>
                </h2>
              </header>
              <Projects data={projects} />
              <footer>
                <small>
                  Select a project above to filter the requests below.
                </small>
              </footer>
            </div>
            <header className={styles.header}>
              <h2>
                Requests <small>{`${data.length} Available`}</small>
              </h2>
            </header>
          </GridColumn>
        </Grid>
        <Grid layout="fluid">
          <GridColumn medium={12}>
            <div id="reports-list-table">
              <DynamicTableStateless
                emptyView={<Empty />}
                head={head}
                rows={rows}
                isLoading={fetchStatus === 'loading'}
                loadingSpinnerSize="large"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={sortProps => onSort(sortProps)}
              />
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
    </div>
  );
}

ReportsMain.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  fetchRequests: PropTypes.func.isRequired,
  fetchStatus: PropTypes.oneOf(['loading', 'loaded', 'failed', 'idle'])
    .isRequired,
  project: PropTypes.string,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      totalRequests: PropTypes.number,
    })
  ).isRequired,
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
