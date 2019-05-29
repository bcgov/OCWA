import * as React from 'react';
import PropTypes from 'prop-types';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Pagination from '@src/components/pagination';
import { RadialChart } from 'react-vis';
import { RequestSchema } from '@src/modules/requests/types';
import { limit } from '@src/services/config';

import head from './head';
import makeRows from './rows';
import * as styles from './styles.css';

function ReportsMain({
  chartData,
  data,
  fetchRequests,
  onSort,
  page,
  sortOrder,
  sortKey,
}) {
  const rows = makeRows(data);
  const isPaginationVisible = data.length > 0;

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <div className={styles.charts}>
            <RadialChart showLabels data={chartData} width={300} height={300} />
          </div>
        </GridColumn>
      </Grid>
      <Grid>
        <GridColumn medium={12}>
          <div id="reports-list-table">
            <DynamicTableStateless
              emptyView={<div>Empty</div>}
              head={head}
              rows={rows}
              loadingSpinnerSize="large"
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSort={sortProps => onSort(sortProps)}
            />
            {isPaginationVisible && (
              <Pagination
                fetch={fetchRequests}
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
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      angle: PropTypes.number,
      label: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  fetchRequests: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onSort: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
};

export default ReportsMain;
