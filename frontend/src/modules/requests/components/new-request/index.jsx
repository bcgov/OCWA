import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import { Link } from 'react-router-dom';
import { colors } from '@atlaskit/theme';

function NewRequestLink({ children, className, onMouseEnter, onMouseLeave }) {
  return (
    <Link
      to="/new"
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

NewRequestLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

function NewRequest({ disabled }) {
  return (
    <Button
      appearance="primary"
      component={disabled ? null : NewRequestLink}
      id="new-request-button"
      iconBefore={
        <AddCircleIcon primaryColor="white" secondaryColor={colors.B500} />
      }
      isDisabled={disabled}
    >
      New Request
    </Button>
  );
}

NewRequest.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

export default NewRequest;
