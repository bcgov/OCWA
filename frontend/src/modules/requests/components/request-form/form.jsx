import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import TextField from '@atlaskit/textfield';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import SectionMessage from '@atlaskit/section-message';
import { uid } from 'react-uid';
import { withRouter } from 'react-router-dom';

import FormField from './field';
import { requestFields } from '../../utils';

function NewRequestForm({ history, isCreating, onSubmit }) {
  return (
    <div id="request-form">
      <Form onSubmit={onSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <FormHeader
              title="Initiate a New Request"
              description="Please ensure that you also have the following elements, as appropriate, with your output submission: descriptive labeling (ideally alongside each component), information for specific output types, and, log files or annotated steps of analysis."
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
            <FormSection
              title="Output Package and/or Output Groups Description "
              description="Describe the context for this output package. If appropriate, you may choose to create Output Groups, which are a collection of output components that are batched for the purposes of description."
            >
              {requestFields.map(d => (
                <Field
                  key={uid(d)}
                  name={d.value}
                  defaultValue=""
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isCreating: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withRouter(NewRequestForm);
