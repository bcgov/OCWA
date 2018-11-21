import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { Link } from 'react-router-dom';
import Date from '@src/components/date';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { FieldTextStateless } from '@atlaskit/field-text';
import head from 'lodash/head';
import last from 'lodash/last';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import RequestIcon from '../request-icon';
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
  onChangeFilter,
  onSearch,
  onSelect,
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
              {d.state < 2 ? (
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    onSelect(d._id);
                  }}
                >
                  {d.name}
                </a>
              ) : (
                <Link to={`/requests/${d._id}`}>{d.name}</Link>
              )}
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
            <DropdownMenu trigger="Actions" triggerType="button">
              <DropdownItemGroup>
                {d.state >= 2 &&
                  d.state < 4 && (
                    <DropdownItem onClick={() => console.log('hi!', d.name)}>
                      Withdraw
                    </DropdownItem>
                  )}
                {d.state < 4 && (
                  <DropdownItem
                    onClick={() => console.log('TODO: Cancel', d.name)}
                  >
                    Cancel
                  </DropdownItem>
                )}
                {d.state < 2 && (
                  <React.Fragment>
                    <DropdownItem
                      onClick={() => console.log(('TODO: Submit', d.name))}
                    >
                      Submit
                    </DropdownItem>
                    <DropdownItem onClick={() => onSelect(d._id)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => console.log('TODO: Delete', d.name)}
                    >
                      Delete
                    </DropdownItem>
                  </React.Fragment>
                )}
              </DropdownItemGroup>
            </DropdownMenu>
          ),
        },
      ],
    };
  });

  return (
    <Page>
      <header className={styles.header}>
        <Grid>
          <GridColumn medium={12}>
            <h1 className={styles.title}>My Requests</h1>
            <nav className={styles.filters}>
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
          <DynamicTableStateless
            emptyView={<h2>No requests yet</h2>}
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
