import * as React from 'react';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import isEmpty from 'lodash/isEmpty';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Form, { Field, FormSection, Validator } from '@atlaskit/form';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

class NewRequest extends React.Component {
  state = {
    open: false,
    isTermsAccepted: false,
  };

  onSubmit = event => {
    event.preventDefault();
    const form = this.formRef.validate();
    console.log(form);

    if (!form.isInvalid) {
      console.log('process!');
    }
  };

  onToggleDialog = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  onTermsChange = () => {
    this.setState(state => ({
      isTermsAccepted: !state.isTermsAccepted,
    }));
  };

  renderFooter = () => (
    <ModalFooter>
      <Button appearance="subtle" onClick={this.onToggleDialog}>
        Cancel
      </Button>
      <Button appearance="primary" onClick={this.onSubmit}>
        Submit
      </Button>
    </ModalFooter>
  );

  render() {
    const { open, isTermsAccepted } = this.state;

    return (
      <React.Fragment>
        <Button appearance="primary" onClick={this.onToggleDialog}>
          New Request
        </Button>
        <ModalTransition>
          {open && (
            <Modal
              footer={this.renderFooter}
              heading="Initiate a New Request"
              width="x-large"
            >
              <Form
                onSubmit={this.onSubmit}
                ref={form => {
                  this.formRef = form;
                }}
              >
                <Field isRequired label="Request Name">
                  <FieldText
                    shouldFitContainer
                    name="name"
                    id="name"
                    value=""
                  />
                </Field>
                <FormSection
                  name="additional"
                  title="Additional Information"
                  description="These fields aren't required but are recommended"
                >
                  <Field label="Purpose" helperText="Purpose of the request">
                    <FieldTextArea shouldFitContainer name="purpose" value="" />
                  </Field>
                  <Field
                    label="Variable Descriptions"
                    helperText="Description of variables in the request"
                  >
                    <FieldTextArea
                      shouldFitContainer
                      name="variableDescriptions"
                      value=""
                    />
                  </Field>
                  <Field
                    label="Selection Criteria"
                    helperText="Selection criteria and sample size description for the request"
                  >
                    <FieldTextArea
                      shouldFitContainer
                      name="selectionCriteria"
                      value=""
                    />
                  </Field>
                  <Field label="Steps" helperText="Annotation of steps taken">
                    <FieldTextArea shouldFitContainer name="steps" value="" />
                  </Field>
                  <Field
                    label="Frequency"
                    helperText="Weighted results and unweighted frequencies"
                  >
                    <FieldTextArea shouldFitContainer name="freq" value="" />
                  </Field>
                  <Field
                    label="Confidentiality"
                    helperText="Confidentiality disclosure to describe how it's upheld when criteria isn't met"
                  >
                    <FieldTextArea
                      shouldFitContainer
                      name="confidentiality"
                      value=""
                    />
                  </Field>
                </FormSection>
                <FormSection>
                  <Field
                    validateOnChange
                    isRequired
                    validators={[
                      <Validator
                        func={() => isTermsAccepted}
                        invalid="You must check this box to submit your request."
                      />,
                    ]}
                  >
                    <Checkbox
                      isChecked={isTermsAccepted}
                      onChange={this.onTermsChange}
                      label="By checking this box I affirm that requested output is safe for release and protects the confidentiality of data, to the best of the authorized user’s knowledge"
                      value="isAffirmed"
                      id="affirmation-checkbox"
                      name="affirmation-checkbox"
                    />
                  </Field>
                </FormSection>
              </Form>
            </Modal>
          )}
        </ModalTransition>
      </React.Fragment>
    );
  }
}

export default NewRequest;
