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
import { _e } from '@src/utils';
import Button from '@atlaskit/button'

import Downloads from '../../containers/downloads';
import renderEmpty from './empty';
import * as styles from './styles.css';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';

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

function Requests({ data, isLoading, onSort, sortKey, sortOrder, page, fetchRequests }) {
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
              {d.exportType !== 'code' && <Downloads request={d} />}
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
            <h1>{_e('Approved {Download} Requests')}</h1>
            <p>
              {_e(
                'The {download} requests listed below are available for download.',
              )}
            </p>
          </header>
        </GridColumn>
        <GridColumn medium={12}>
          <DynamicTableStateless
            emptyView={renderEmpty(zone)}
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
      
      <nav className={styles.container}>
          <Button
              appearance="subtle"
              iconBefore={<ChevronLeftLargeIcon />}
              id={`previousPage`} 
              isDisabled={page <= 1}
              onClick={() => fetchRequests({ page: (page - 1) }  ) && onSort({key: sortKey, sortOrder: sortOrder, page: (page-1)})}
            >
              Previous Page
          </Button>
        
          <Button 
              appearance="subtle"
              iconAfter={<ChevronRightLargeIcon />}
              id={`nextPage`} 
              isDisabled={( (rows.length <= 0) || (rows.length % 100 !== 0) )}
              onClick={() => fetchRequests({ page: (page + 1) }  ) && onSort({key: sortKey, sortOrder: sortOrder, page: (page+1)})}
            >
              Next Page
          </Button>
        </nav>
      
    </Page>
  );
}

Requests.propTypes = {
  data: PropTypes.arrayOf(RequestSchema).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSort: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  fetchRequests: PropTypes.func.isRequired,
};

export default Requests;
