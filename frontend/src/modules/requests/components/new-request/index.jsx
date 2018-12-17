import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import uniqueId from 'lodash/uniqueId';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import { colors } from '@atlaskit/theme';

function NewRequest({ disabled, onClick }) {
  const clickHandler = () => onClick(uniqueId('request'));

  return (
    <Button
      appearance="primary"
      id="new-request-button"
      iconBefore={
        <AddCircleIcon primaryColor="white" secondaryColor={colors.B500} />
      }
      isDisabled={disabled}
      onClick={clickHandler}
    >
      New Request
    </Button>
  );
}

NewRequest.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NewRequest;
