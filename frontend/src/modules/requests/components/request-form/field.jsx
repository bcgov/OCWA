import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';

import { phoneNumberRegex, repositoryRegex, gitUrlRegex } from '../../utils';

function Field({ type, fieldProps }) {
  switch (type) {
    case 'textarea':
      // TODO: Add other possible types like checkboxes, etc if needed
      return <TextArea {...fieldProps} />;

    case 'tel':
      return (
        <TextField {...fieldProps} type="tel" pattern={phoneNumberRegex} />
      );

    case 'repositoryHost':
      return (
        <TextField {...fieldProps} type="text" pattern={repositoryRegex} />
      );

    case 'git':
      return <TextField {...fieldProps} type="text" pattern={gitUrlRegex} />;

    case 'text':
    default:
      return <TextField {...fieldProps} />;
  }
}

Field.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'tel',
    'textarea',
    'url',
    'git',
    'repositoryHost',
  ]).isRequired,
  fieldProps: PropTypes.object.isRequired,
};

export default Field;
