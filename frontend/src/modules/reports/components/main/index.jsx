import * as React from 'react';
import PropTypes from 'prop-types';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import isSameDay from 'date-fns/is_same_day';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Pagination from '@src/components/pagination';
import {
  FlexibleWidthXYPlot,
  Highlight,
  HorizontalGridLines,
  VerticalBarSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import { RequestSchema } from '@src/modules/requests/types';
import { limit } from '@src/services/config';
import { colors } from '@atlaskit/theme';

import head from './head';
import makeRows from './rows';
import Filters from './filters';
import * as styles from './styles.css';

function ReportsMain({
  chartData,
  data,
  endDate,
  fetchRequests,
  onSort,
  onDateChange,
  onDateRangeChange,
  onRequestStateChange,
  page,
  requestState,
  sortOrder,
  sortKey,
  startDate,
}) {
  const rows = makeRows(data);
  const isPaginationVisible = data.length > 0;
  const lineStyles = {
    line: { stroke: colors.N60 },
    text: { stroke: 'none', fill: colors.N60 },
  };
  const xAxisStartPadding = { y: 0, x: new Date(startDate).getTime() };
  const xAxisEndPadding = { y: 0, x: new Date(endDate).getTime() };
  const onDragEnd = ({ left, right }) => {
    if (!left || !right || isSameDay(left, right)) return;
    onDateRangeChange({ left, right });
  };

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <header className={styles.header}>
            <h2>Recent Adjudications</h2>
          </header>
          <div className={styles.charts}>
            <FlexibleWidthXYPlot
              height={300}
              xType="time"
              margin={{ bottom: 70 }}
            >
              <HorizontalGridLines />
              <VerticalBarSeries
                barWidth={0.1}
                color={colors.Y300}
                data={[xAxisStartPadding, ...chartData, xAxisEndPadding]}
              />
              <XAxis
                tickLabelAngle={-45}
                title="Adjudication Date"
                style={lineStyles}
              />
              <YAxis title="Total" style={lineStyles} />
              <Highlight
                drag
                color={colors.DN900}
                enableY={false}
                onDragEnd={onDragEnd}
              />
            </FlexibleWidthXYPlot>
          </div>
          <Filters
            endDate={endDate}
            onDateChange={onDateChange}
            onRequestStateChange={onRequestStateChange}
            requestState={requestState}
            startDate={startDate}
          />
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
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      angle: PropTypes.number,
      label: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  endDate: PropTypes.string.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  onRequestStateChange: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  requestState: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
  startDate: PropTypes.string.isRequired,
};

export default ReportsMain;
