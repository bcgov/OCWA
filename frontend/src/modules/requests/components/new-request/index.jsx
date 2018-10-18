import * as React from 'react';
import Button from '@atlaskit/button';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
  Validator,
} from '@atlaskit/form';

class NewRequest extends React.Component {
  state = {
    open: false,
    name: '',
    tags: '',
    purpose: '',
    variableDescriptions: '',
    selectionCriteria: '',
    steps: '',
    freq: '',
    confidentiality: '',
  };

  onChange = () => {
    console.log(this.formRef.validate());
  };

  onSubmit = (...args) => {
    console.log(args);
  };

  onToggleDialog = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  render() {
    const {
      open,
      name,
      tags,
      purpose,
      variableDescriptions,
      selectionCriteria,
      steps,
      freq,
      confidentiality,
    } = this.state;
    const actions = [
      { text: 'Cancel', onClick: this.onToggleDialog },
      { text: 'Next Step', onClick: this.onToggleDialog },
    ];

    return (
      <React.Fragment>
        <Button appearance="primary" onClick={this.onToggleDialog}>
          New Request
        </Button>
        <ModalTransition>
          {open && (
            <Modal
              actions={actions}
              heading="Initiate a New Request"
              width="x-large"
            >
              <Form
                onSubmit={this.onSubmit}
                ref={form => {
                  this.formRef = form;
                }}
              >
                <Field label="Request Name" isRequired>
                  <FieldText
                    shouldFitContainer
                    onChange={this.onChange}
                    value={name}
                  />
                </Field>
                <Field label="Purpose" helperText="Purpose of the request">
                  <FieldTextArea shouldFitContainer value={purpose} />
                </Field>
                <Field
                  label="Variable Descriptions"
                  helperText="Description of variables in the request"
                >
                  <FieldTextArea
                    shouldFitContainer
                    value={variableDescriptions}
                  />
                </Field>
                <Field
                  label="Selection Criteria"
                  helperText="Selection criteria and sample size description for the request"
                >
                  <FieldTextArea shouldFitContainer value={selectionCriteria} />
                </Field>
                <Field label="Steps" helperText="Annotation of steps taken">
                  <FieldTextArea shouldFitContainer value={steps} />
                </Field>
                <Field
                  label="Frequency"
                  helperText="Weighted results and unweighted frequencies"
                >
                  <FieldTextArea shouldFitContainer value={freq} />
                </Field>
                <Field
                  label="Confidentiality"
                  helperText="Confidentiality disclosure to describe how it's upheld when criteria isn't met"
                >
                  <FieldTextArea shouldFitContainer value={confidentiality} />
                </Field>
              </Form>
            </Modal>
          )}
        </ModalTransition>
      </React.Fragment>
    );
  }
}

export default NewRequest;
