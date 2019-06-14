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
  FormHeader,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import pick from 'lodash/pick';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import { uid } from 'react-uid';
import { withRouter } from 'react-router-dom';

import FormField from './field';
import { formText, requestFields } from '../../utils';
import { RequestSchema } from '../../types';

function NewRequestForm({ data, history, isCreating, onSubmit }) {
  // Grab the files if there is a duplicate getting passed through
  const duplicateFiles = pick(data, ['files', 'supportingFiles']);
  const exportTypeOptions = [
    { label: 'Data Export', value: 'data' },
    { label: 'Code Export', value: 'code' },
  ];
  const [exportType, setExportType] = React.useState(exportTypeOptions[0]);
  console.log(exportType);
  const test = Math.random();
  const onSubmitHandler = React.useCallback(formData => {
    console.log(test);
    // onSubmit({ ...formData, exportType: exportTypeValue }, duplicateFiles);
  });
  console.log(test);

  return (
    <div id="request-form">
      <Form onSubmit={onSubmitHandler}>
        {({ formProps }) => (
          <form {...formProps}>
            <FormHeader
              title={`Initiate a New ${exportType.label} Request`}
              description="Please ensure that you also have the following elements, as appropriate, with your output submission: descriptive labeling (ideally alongside each component), information for specific output types, and, log files or annotated steps of analysis."
            />
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
            <Select
              options={exportTypeOptions}
              placeholder="Choose an Export Type"
              defaultValue={exportType}
              onChange={value => setExportType(value)}
            />
            <FormSection
              title={get(formText, ['code', 'title'])}
              description={get(formText, ['code', 'description'])}
            >
              {requestFields
                .filter(
                  d =>
                    d.exportType === 'all' || d.exportType === exportType.value
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
