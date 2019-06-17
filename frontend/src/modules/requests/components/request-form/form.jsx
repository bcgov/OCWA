import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import get from 'lodash/get';
import TextField from '@atlaskit/textfield';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import pick from 'lodash/pick';
import SectionMessage from '@atlaskit/section-message';
import { uid } from 'react-uid';
import { withRouter } from 'react-router-dom';

import FormField from './field';
import { formText, requestFields } from '../../utils';
import { RequestSchema } from '../../types';

function NewRequestForm({ data, exportType, history, isCreating, onSubmit }) {
  // Grab the files if there is a duplicate getting passed through
  const duplicateFiles = pick(data, ['files', 'supportingFiles']);

  return (
    <div id="request-form">
      <Form onSubmit={formData => onSubmit(formData, duplicateFiles)}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field
              isRequired
              name="name"
              label="Request Title"
              defaultValue={get(data, 'name', '')}
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
            <FormSection
              title={get(formText, [exportType, 'title'])}
              description={get(formText, [exportType, 'description'])}
            >
              {requestFields
                .filter(
                  d => d.exportType === 'all' || d.exportType === exportType
                )
                .map(d => (
                  <Field
                    key={uid(d)}
                    name={d.value}
                    defaultValue={get(data, d.value, '')}
                    label={d.name}
                    isDisabled={isCreating}
                    isRequired={d.isRequired}
                  >
                    {({ fieldProps }) => (
                      <React.Fragment>
                        <FormField type={d.type} fieldProps={fieldProps} />
                        <HelperMessage>{d.helperText}</HelperMessage>
                      </React.Fragment>
                    )}
                  </Field>
                ))}
            </FormSection>
            <FormSection>
              <SectionMessage
                appearance="warning"
                title="Affirmation of Confidentiality"
              >
                <p>
                  By completing this form and submitting the output package for
                  review, I affirm that the requested outputs are safe for
                  release and protect the confidentiality of data, to the best
                  of my knowledge.
                </p>
              </SectionMessage>
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
  data: RequestSchema,
  exportType: PropTypes.oneOf(['code', 'data']),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isCreating: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

NewRequestForm.defaultProps = {
  data: {},
};

export default withRouter(NewRequestForm);
