import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import Button from '@atlaskit/button';
import { Link, withRouter } from 'react-router-dom';
import { colors } from '@atlaskit/theme';

function LinkElement({ children, className, onMouseEnter, onMouseLeave }) {
  return (
    <Link
      to="/downloads"
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

LinkElement.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

function DownloadsLink({ location }) {
  return (
    <Button
      appearance="primary"
      component={LinkElement}
      isDisabled={location.pathname === '/downloads'}
      iconBefore={
        <ArrowDownCircleIcon
          primaryColor="white"
          secondaryColor={colors.B500}
        />
      }
    >
      Downloads
    </Button>
  );
}

DownloadsLink.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withRouter(DownloadsLink);
