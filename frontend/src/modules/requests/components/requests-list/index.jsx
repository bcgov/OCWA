import * as React from 'react';
import PropTypes from 'prop-types';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import Button, { ButtonGroup } from '@atlaskit/button';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { Link } from 'react-router-dom';
import Date from '@src/components/date';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { FieldTextStateless } from '@atlaskit/field-text';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { colors } from '@atlaskit/theme';
import { limit } from '@src/services/config';

import RequestIcon from '../request-icon';
import RequestMenu from '../../containers/request-menu';
import NewRequest from '../../containers/new-request';
import * as styles from './styles.css';

const header = {
  cells: [
    { key: 'state', content: 'Status', isSortable: true, width: 10 },
    {
      key: 'name',
      content: 'Request Identifier',
      shouldTruncate: true,
      isSortable: true,
    },
    { key: 'submittedOn', content: 'Submitted On', isSortable: true },
    { key: 'updatedOn', content: 'Updated On', isSortable: true },
    { key: 'outputChecker', content: 'Output Checker', isSortable: true },
    { key: 'more', shouldTruncate: true, width: 18 },
  ],
};

const filters = [
  { label: 'All', filter: null },
  { label: 'Draft', filter: [0, 1] },
  { label: 'Queued/In Review', filter: [2, 3, 9] },
  { label: 'Flagged', filter: 4 },
  { label: 'Denied', filter: 5 },
  { label: 'Cancelled', filter: 6 },
];

function RequestsList({
  data,
  fetchRequests,
  filter,
  isFailed,
  isLoading,
  isLoaded,
  onChangeFilter,
  onSearch,
  onSort,
  page,
  search,
  sortKey,
  sortOrder,
}) {
  const rows = data.map(d => {
    const format = 'MMM Do, YYYY';
    const submittedOn = head(d.chronology).timestamp;
    const updatedOn = last(d.chronology).timestamp;

    return {
      key: `row-${d._id}`,
      cells: [
        {
          key: d.state,
          content: <RequestIcon value={d.state} size="medium" />,
        },
        {
          key: d.name,
          content: (
            <strong>
              <Link to={`/requests/${d._id}`}>{d.name}</Link>
            </strong>
          ),
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
          key: 0,
          content: '-',
        },
        {
          content: (
            <div className={styles.actionsColumn}>
              <div>
                <AttachmentIcon size="small" />
                {` ${get(d, 'files.length', 0)}`}
              </div>
              <RequestMenu data={d} />
            </div>
          ),
        },
      ],
    };
  });

  const renderEmpty = () => {
    let textElement = null;
    let Icon = DocumentsIcon;

    if (search) {
      Icon = SearchIcon;
      textElement = (
        <h3>
          {'No results match '}
          <em className={styles.searchText}>{search}</em>
        </h3>
      );
    } else if (isFailed) {
      Icon = ErrorIcon;
      textElement = <h3>Failed to load requests</h3>;
    } else if (isLoaded && !filter && page <= 1) {
      textElement = (
        <div>
          <h3>You have no requests yet</h3>
          <p>Get started with OCWA by creating a new Request</p>
          <div>
            <NewRequest />
          </div>
        </div>
      );
    } else if (isLoaded && page > 1) {
      textElement = <h3>No requests could be loaded for this page</h3>;
    } else if (isLoaded && !!filter) {
      textElement = <h3>No requests match this filter</h3>;
    }

    return (
      <div className={styles.empty}>
        <Icon
          size="xlarge"
          primaryColor={isFailed ? colors.R500 : colors.N70}
        />
        {textElement}
      </div>
    );
  };
  const isPaginationVisible = data.length > 0 && !search;

  return (
    <Page>
      <header id="requests-list-header" className={styles.header}>
        <Grid>
          <GridColumn medium={12}>
            <h1 className={styles.title}>My Requests</h1>
            <nav id="requests-list-filters" className={styles.filters}>
              <ButtonGroup>
                {filters.map(d => (
                  <Button
                    key={d.label}
                    isSelected={d.filter === filter}
                    onClick={() => onChangeFilter(d.filter)}
                  >
                    {d.label}
                  </Button>
                ))}
              </ButtonGroup>
              <FieldTextStateless
                isLabelHidden
                shouldFitContainer={false}
                id="requests-list-search"
                placeholder="Search Requests"
                onChange={event => onSearch(event.target.value)}
                value={search}
              />
            </nav>
          </GridColumn>
        </Grid>
      </header>
      <Grid>
        <GridColumn medium={12}>
          <div id="requests-list-table">
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
            {isPaginationVisible && (
              <nav className={styles.pagination}>
                <Button
                  appearance="subtle"
                  iconBefore={<ChevronLeftLargeIcon />}
                  isDisabled={page <= 1}
                  onClick={() => fetchRequests(page - 1)}
                >
                  Previous Page
                </Button>
                <Button
                  appearance="subtle"
                  iconAfter={<ChevronRightLargeIcon />}
                  isDisabled={data.length < limit * page}
                  onClick={() => fetchRequests(page + 1)}
                >
                  Next Page
                </Button>
              </nav>
            )}
          </div>
        </GridColumn>
      </Grid>
    </Page>
  );
}

RequestsList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      state: PropTypes.number,
    })
  ),
  fetchRequests: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  isFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  // onSelect: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['DESC', 'ASC']).isRequired,
};

RequestsList.defaultProps = {
  data: [],
  filter: null,
};

export default RequestsList;
