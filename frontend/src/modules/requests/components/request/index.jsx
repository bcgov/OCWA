import * as React from 'react';
import PropTypes from 'prop-types';
import DynamicTable from '@atlaskit/dynamic-table';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Date from '@src/components/date';

import StateLabel from '../state-label';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

const head = {
  cells: [
    { key: 'selected', content: '', width: 10 },
    { key: 'name', content: 'File Name', isSortable: true },
    { key: 'fileType', content: 'File Type', isSortable: true },
    { key: 'fileSize', content: 'File Size', isSortable: true },
    { key: 'modifiedAt', content: 'Date Modified', isSortable: true },
  ],
};

const Empty = <div style={{ marginBottom: 30 }}>No files have been added</div>;

function Request({ data, updatedAt }) {
  const rows = [];

  return (
    <Page>
      <header className={styles.header}>
        <Grid>
          <GridColumn medium={9}>
            <h1>{data.name}</h1>
            <p>
              Updated <Date value={updatedAt} format="HH:MM on MMMM Do, YYYY" />
            </p>
          </GridColumn>
          <GridColumn medium={3}>
            <div style={{ textAlign: 'right' }}>
              <StateLabel value={data.state} />
            </div>
          </GridColumn>
        </Grid>
      </header>
      <div className={styles.main}>
        <Grid>
          <GridColumn medium={9}>
            <div className={styles.section}>
              <h4>Purpose</h4>
              <p>{data.purpose}</p>
            </div>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Export Files</div>
              <div className={styles.sectionContent}>
                <DynamicTable emptyView={Empty} head={head} rows={rows} />
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Support Files</div>
              <div className={styles.sectionContent}>
                <DynamicTable emptyView={Empty} head={head} rows={rows} />
              </div>
            </div>
          </GridColumn>
          <GridColumn medium={3}>
            <h6>Output Checker</h6>
            <p>Roz</p>
            <h6>Actions</h6>
            <ul>
              <li>
                <a href="#">Edit Request</a>
              </li>
              <li>
                <a href="#">Cancel Request</a>
              </li>
            </ul>
          </GridColumn>
        </Grid>
      </div>
    </Page>
  );
}

Request.propTypes = {
  data: RequestSchema,
  updatedAt: PropTypes.string,
  fetchStatus: PropTypes.string.isRequired,
};

export default Request;
