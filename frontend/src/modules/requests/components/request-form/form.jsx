import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import { uid } from 'react-uid';
import { withRouter } from 'react-router-dom';

import { requestFields } from '../../utils';

function NewRequestForm({ history, isCreating, onSubmit }) {
  return (
    <div id="request-form">
      <Form onSubmit={onSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <FormHeader
              title="Initiate a New Request"
              description="Output Files can be added once the request has been created."
            />
            <Field
              isRequired
              name="name"
              label="Request Title"
              defaultValue=""
              isDisabled={isCreating}
            >
              {({ fieldProps, error }) => (
                <React.Fragment>
                  <TextField autoFocus autoComplete="off" {...fieldProps} />
                  {!error && (
                    <HelperMessage>
                      Must be a unique request name.
                    </HelperMessage>
                  )}
                  {error && (
                    <ErrorMessage>
                      This user name is already in use, try another one.
                    </ErrorMessage>
                  )}
                </React.Fragment>
              )}
            </Field>
            <FormSection title="Additional Fields">
              {requestFields.map(d => (
                <Field
                  key={uid(d)}
                  name={d.value}
                  defaultValue=""
                  label={d.name}
                  isDisabled={isCreating}
                >
                  {({ fieldProps }) => (
                    <React.Fragment>
                      <TextArea {...fieldProps} />
                      <HelperMessage>{d.helperText}</HelperMessage>
                    </React.Fragment>
                  )}
                </Field>
              ))}
            </FormSection>
            <FormFooter>
              <ButtonGroup>
                <Button
                  appearance="default"
                  id="request-form-cancel-button"
                  isDisabled={isCreating}
                  onClick={() => history.push('/')}
                >
                  Cancel
                </Button>
                <Button
                  id="request-form-save-files-button"
                  iconAfter={
                    <ArrowRightCircleIcon secondaryColor={colors.B500} />
                  }
                  isDisabled={isCreating}
                  isLoading={isCreating}
                  appearance="primary"
                  type="submit"
                >
                  Create Request
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
}

NewRequestForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isCreating: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withRouter(NewRequestForm);
