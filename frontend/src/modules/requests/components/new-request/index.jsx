import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import uniqueId from 'lodash/uniqueId';

function NewRequest({ disabled, onClick }) {
  const clickHandler = () => onClick(uniqueId('request'));

  return (
    <Button appearance="primary" isDisabled={disabled} onClick={clickHandler}>
      New Request
    </Button>
  );
}

NewRequest.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NewRequest;
