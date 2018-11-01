import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Form, { Field, FormSection, Validator } from '@atlaskit/form';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

import FileUploader from './file-uploader';

class NewRequest extends React.Component {
  state = {
    open: false,
    step: 1,
    files: [],
    isTermsAccepted: false,
    name: '',
    tags: '',
    purpose: '',
    variableDescriptions: '',
    selectionCriteria: '',
    steps: '',
    freq: '',
    confidentiality: '',
  };

  onSubmit = event => {
    const { onCreate } = this.props;
    const { open, isTermsSelected, ...payload } = this.state;
    const form = this.formRef.validate();
    event.preventDefault();

    if (!form.isInvalid) {
      onCreate(payload);
      this.setState({ open: false });
    }
  };

  reset = () => {
    this.setState({
      isTermsAccepted: false,
      files: [],
      step: 1,
      name: '',
      tags: '',
      purpose: '',
      variableDescriptions: '',
      selectionCriteria: '',
      steps: '',
      freq: '',
      confidentiality: '',
    });
  };

  onToggleDialog = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  onChange = key => event => {
    this.setState({
      [key]: event.target.value,
    });
  };

  onTermsChange = () => {
    this.setState(state => ({
      isTermsAccepted: !state.isTermsAccepted,
    }));
  };

  onUploadSuccess = file => {
    this.setState(state => ({
      files: [...state.files, file],
    }));
  };

  onChangeStep = step => () => {
    this.setState({
      step,
    });
  };

  renderFooter = () => {
    const { files, step } = this.state;
    let buttonElements = [];

    if (step === 1) {
      buttonElements = [
        <Button
          key="step1Btn1"
          appearance="subtle"
          onClick={this.onToggleDialog}
        >
          Cancel
        </Button>,
        <Button
          key="step1Btn2"
          appearance="primary"
          onClick={this.onChangeStep(2)}
        >
          Next Step
        </Button>,
      ];
    } else if (step === 2) {
      buttonElements = [
        <Button
          key="step2Btn1"
          appearance="subtle"
          onClick={this.onToggleDialog}
        >
          Cancel
        </Button>,
        <div key={0} style={{ flex: 1 }} />,
        <ButtonGroup key={2}>
          <Button
            key="step2Btn2"
            appearance="primary"
            onClick={this.onChangeStep(1)}
            style={{ marginRight: 4 }}
          >
            Previous Step
          </Button>
          <Button key="step2Btn3" appearance="primary" onClick={this.onSubmit}>
            Submit
          </Button>
        </ButtonGroup>,
      ];
    }

    return <ModalFooter>{buttonElements}</ModalFooter>;
  };

  render() {
    const {
      open,
      isTermsAccepted,
      name,
      tags,
      purpose,
      variableDescriptions,
      selectionCriteria,
      step,
      steps,
      freq,
      confidentiality,
    } = this.state;

    return (
      <React.Fragment>
        <Button appearance="primary" onClick={this.onToggleDialog}>
          New Request
        </Button>
        <ModalTransition>
          {open && (
            <Modal
              footer={this.renderFooter}
              heading={<div>{`Initiate a New Request (Step ${step}/2)`}</div>}
              onCloseComplete={this.reset}
              width="x-large"
            >
              {step === 1 && (
                <FileUploader onUploadSuccess={this.onUploadSuccess} />
              )}
              {step === 2 && (
                <Form
                  onSubmit={this.onSubmit}
                  ref={form => {
                    this.formRef = form;
                  }}
                >
                  <Field
                    validateOnChange
                    validateOnBlur
                    isRequired
                    label="Request Name"
                  >
                    <FieldText
                      shouldFitContainer
                      name="name"
                      id="name"
                      value={name}
                      onChange={this.onChange('name')}
                    />
                  </Field>
                  <FormSection
                    name="additional"
                    title="Additional Information"
                    description="These fields aren't required but are recommended"
                  >
                    <Field label="Purpose" helperText="Purpose of the request">
                      <FieldTextArea
                        shouldFitContainer
                        name="purpose"
                        value={purpose}
                        onChange={this.onChange('purpose')}
                      />
                    </Field>
                    <Field
                      label="Variable Descriptions"
                      helperText="Description of variables in the request"
                    >
                      <FieldTextArea
                        shouldFitContainer
                        name="variableDescriptions"
                        value={variableDescriptions}
                        onChange={this.onChange('variableDescriptions')}
                      />
                    </Field>
                    <Field
                      label="Selection Criteria"
                      helperText="Selection criteria and sample size description for the request"
                    >
                      <FieldTextArea
                        shouldFitContainer
                        name="selectionCriteria"
                        value={selectionCriteria}
                        onChange={this.onChange('selectionCriteria')}
                      />
                    </Field>
                    <Field label="Steps" helperText="Annotation of steps taken">
                      <FieldTextArea
                        shouldFitContainer
                        name="steps"
                        value={steps}
                        onChange={this.onChange('steps')}
                      />
                    </Field>
                    <Field
                      label="Frequency"
                      helperText="Weighted results and unweighted frequencies"
                    >
                      <FieldTextArea
                        shouldFitContainer
                        name="freq"
                        value={freq}
                        onChange={this.onChange('freq')}
                      />
                    </Field>
                    <Field
                      label="Confidentiality"
                      helperText="Confidentiality disclosure to describe how it's upheld when criteria isn't met"
                    >
                      <FieldTextArea
                        shouldFitContainer
                        name="confidentiality"
                        value={confidentiality}
                        onChange={this.onChange('confidentiality')}
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
              )}
            </Modal>
          )}
        </ModalTransition>
      </React.Fragment>
    );
  }
}

export default NewRequest;
