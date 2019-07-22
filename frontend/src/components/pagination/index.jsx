import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';

import * as styles from './styles.css';

function Pagination({ isLastPage, onClick, page }) {
  return (
    <nav className={styles.container}>
      <Button
        appearance="subtle"
        iconBefore={<ChevronLeftLargeIcon />}
        isDisabled={page <= 1}
        onClick={() => onClick(page - 1)}
      >
        Previous Page
      </Button>
      <Button
        appearance="subtle"
        iconAfter={<ChevronRightLargeIcon />}
        isDisabled={isLastPage}
        onClick={() => onClick(page + 1)}
      >
        Next Page
      </Button>
    </nav>
  );
}

Pagination.propTypes = {
  isLastPage: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Pagination;
