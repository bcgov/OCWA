import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-formio';
import omit from 'lodash/omit';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function FormWrapper({ formId, isLoading, onSubmit, ...formProps }) {
  const onSubmitHandler = ({ data }) => {
    const formData = omit(data, 'submit');
    onSubmit(formData, formId);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="medium" />
      </div>
    );
  }

  return <Form {...formProps} onSubmit={onSubmitHandler} />;
}

FormWrapper.propTypes = {
  formId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormWrapper;
