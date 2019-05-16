import * as React from 'react';
import PropTypes from 'prop-types';
import Date from '@src/components/date';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import head from 'lodash/head';
import last from 'lodash/last';
import { Link } from 'react-router-dom';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { RequestSchema } from '@src/modules/requests/types';
import { zone } from '@src/services/config';

import Downloads from '../../containers/downloads';
import renderEmpty from './empty';
import * as styles from './styles.css';

const header = {
  cells: [
    {
      key: 'name',
      content: 'Request Identifier',
      shouldTruncate: true,
      isSortable: true,
    },
    { key: 'submittedOn', content: 'Submitted On', isSortable: true },
    { key: 'updatedOn', content: 'Updated On', isSortable: true },
    { key: 'reviewers', content: 'Output Checker', isSortable: true },
    { key: 'actions', shouldTruncate: true, width: 23 },
  ],
};

function Requests({ data, isLoading, onSort, sortKey, sortOrder }) {
  const zoneString = zone === 'internal' ? 'import' : 'export';
  const rows = data.map(d => {
    const format = 'MMM Do, YYYY';
    const submittedOn = head(d.chronology).timestamp;
    const updatedOn = last(d.chronology).timestamp;
    const reviewer = last(d.reviewers);

    return {
      key: `row-${d._id}`,
      cells: [
        {
          key: d.name,
          content: <strong>{d.name}</strong>,
        },
        {
          key: submittedOn,
          content: <Date value={submittedOn} format={format} />,
        },
        {
          key: updatedOn,
          content: <Date value={updatedOn} format={format} />,
        },
        {
          key: reviewer,
          content: reviewer,
        },
        {
          content: (
            <div className={styles.actionsColumn}>
              <Downloads request={d} />
            </div>
          ),
        },
      ],
    };
  });

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <header className={styles.header}>
            <div className={styles.backButton}>
              <Link to="/">&laquo; Back to Requests</Link>
            </div>
            <h1>Approved Requests</h1>
            <p>
              {`The ${zoneString} requests listed below are available for download.`}
            </p>
          </header>
        </GridColumn>
        <GridColumn medium={12}>
          <DynamicTableStateless
            emptyView={renderEmpty()}
            head={header}
            rows={rows}
            loadingSpinnerSize="large"
            isLoading={isLoading}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={sortProps => onSort(sortProps)}
          />
        </GridColumn>
      </Grid>
    </Page>
  );
}

Requests.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSort: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

export default Requests;
