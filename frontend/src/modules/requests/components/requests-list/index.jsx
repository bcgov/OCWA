import * as React from 'react';
import PropTypes from 'prop-types';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import Button, { ButtonGroup } from '@atlaskit/button';
import CodeIcon from '@atlaskit/icon/glyph/code';
import { Link } from 'react-router-dom';
import Date from '@src/components/date';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import Loading from '@src/components/loading';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Pagination from '@src/components/pagination';
import PersonIcon from '@atlaskit/icon/glyph/person';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Title from '@src/components/title';
import { colors } from '@atlaskit/theme';
import { limit } from '@src/services/config';

import NewRequest from '../../containers/new-request';
import RequestIcon from '../request-icon';
import RequestMenu from '../../containers/request-menu';
import Search from '../../containers/search';
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
    { key: 'author', content: 'Requester', isSortable: true },
    { key: 'outputChecker', content: 'Output Checker', isSortable: true },
    { key: 'more', shouldTruncate: true, width: 18 },
  ],
};

const filters = [
  { label: 'All', filter: null },
  { label: 'Draft', filter: [0, 1] },
  { label: 'Queued/In Review', filter: [2, 3, 9] },
  { label: 'Approved', filter: 4 },
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
  onShowMyRequests,
  onSort,
  page,
  search,
  showMyRequestsOnly,
  sortKey,
  sortOrder,
}) {
  const requestsButtonIcon = showMyRequestsOnly ? (
    <PeopleGroupIcon />
  ) : (
    <PersonIcon />
  );
  const requestsButtonString = showMyRequestsOnly
    ? 'Show Team Requests'
    : 'Show My Requests';
  const rows = data.map(d => {
    const format = 'MMM Do, YYYY';
    const submittedOn = head(d.chronology).timestamp;
    const updatedOn = last(d.chronology).timestamp;
    const outputChecker = head(d.reviewers);

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
          key: d.author,
          content: d.author,
        },
        {
          key: outputChecker,
          content: outputChecker || <em>Unassigned</em>,
        },
        {
          content: (
            <div className={styles.actionsColumn}>
              {d.exportType === 'code' && <CodeIcon />}
              {d.exportType !== 'code' && (
                <div>
                  <AttachmentIcon size="small" />
                  {` ${get(d, 'files.length', 0)}`}
                </div>
              )}
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
      <Loading loading={isLoading} />
      <Title>My Requests</Title>
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
              <ButtonGroup>
                <Button
                  appearance={showMyRequestsOnly ? 'primary' : null}
                  iconBefore={requestsButtonIcon}
                  onClick={onShowMyRequests}
                >
                  {requestsButtonString}
                </Button>
              </ButtonGroup>
              <Search />
            </nav>
          </GridColumn>
        </Grid>
      </header>
      <Grid>
        <GridColumn medium={12}>
          <div id="requests-list-table" className={styles.table}>
            <DynamicTableStateless
              emptyView={renderEmpty()}
              head={header}
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
    }),
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
  onShowMyRequests: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  showMyRequestsOnly: PropTypes.bool.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['DESC', 'ASC']).isRequired,
};

RequestsList.defaultProps = {
  data: [],
  filter: null,
};

export default RequestsList;
