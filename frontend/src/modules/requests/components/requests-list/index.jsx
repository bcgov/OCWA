import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Link } from 'react-router-dom';
import Date from '@src/components/date';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import { FieldTextStateless } from '@atlaskit/field-text';
import head from 'lodash/head';
import last from 'lodash/last';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { akColorN70 } from '@atlaskit/util-shared-styles';

import RequestIcon from '../request-icon';
import RequestMenu from '../../containers/request-menu';
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
    { key: 'more', shouldTruncate: true },
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
  filter,
  isLoading,
  isLoaded,
  onChangeFilter,
  onSearch,
  onSort,
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
          content: <RequestMenu data={d} />,
        },
      ],
    };
  });

  const renderEmpty = () => {
    let text = 'You have no requests';
    let Icon = DocumentsIcon;

    if (search) {
      Icon = SearchIcon;
      text = `No results match ${search}'`;
    } else if (isLoaded && !filter) {
      text = 'You have no requests!';
    } else if (isLoaded && !!filter) {
      text = 'No requests match this filter';
    }

    return (
      <div className={styles.empty}>
        <Icon size="xlarge" primaryColor={akColorN70} />
        <h3>{text}</h3>
      </div>
    );
  };

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
  filter: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['DESC', 'ASC']).isRequired,
};

RequestsList.defaultProps = {
  data: [],
  filter: null,
};

export default RequestsList;
