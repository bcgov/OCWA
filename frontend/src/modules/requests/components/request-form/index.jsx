import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import PropTypes from 'prop-types';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

import Form from './form';
import FileUploader from './file-uploader';

class NewRequestDialog extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  validateForm = () => {
    const { isInvalid, validFields } = this.formRef.current.validate();

    if (!isInvalid) {
      return validFields.reduce(
        (prev, field) => ({
          ...prev,
          [field.name]: field.value,
        }),
        {}
      );
    }

    return false;
  };

  onSaveAndClose = () => {
    const { currentStep, data, onCancel } = this.props;

    if (currentStep === 0) {
      const formValues = this.validateForm();

      if (formValues) {
        this.save(formValues, true);
      }
    } else if (currentStep === 1) {
      this.save(
        {
          ...data,
          files: [],
        },
        true
      );
    }
  };

  onAddFiles = () => {
    const { currentStep, onChangeStep } = this.props;
    const formValues = this.validateForm();

    if (formValues) {
      this.save(formValues);
      onChangeStep(currentStep + 1);
    }
  };

  onSubmit = () => {
    const { data, sendAction } = this.props;
    sendAction('onSubmit', data, { quitEditing: true });
  };

  save = (payload, quitEditing = false) => {
    const { isNewRequest, sendAction } = this.props;

    if (isNewRequest) {
      sendAction('onCreate', payload, { quitEditing });
    } else {
      sendAction('onSave', payload, { quitEditing });
    }
  };

  renderFooter = () => {
    const { currentStep, isCreating, onCancel } = this.props;

    return (
      <ModalFooter>
        <Button
          appearance="default"
          isDisabled={isCreating}
          onClick={this.onSaveAndClose}
        >
          Save and Close
        </Button>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button
            appearance="default"
            isDisabled={isCreating}
            onClick={onCancel}
          >
            Cancel
          </Button>
          {currentStep === 0 && (
            <Button
              isDisabled={isCreating}
              appearance="primary"
              onClick={this.onAddFiles}
            >
              {isCreating ? 'Creating...' : 'Add Files'}
            </Button>
          )}
          {currentStep === 1 && (
            <Button appearance="primary" onClick={this.onSubmit}>
              Submit for Review
            </Button>
          )}
        </ButtonGroup>
      </ModalFooter>
    );
  };

  render() {
    const { currentStep, data, open } = this.props;

    return (
      <ModalTransition>
        {open && (
          <Modal
            autoFocus
            footer={this.renderFooter}
            heading={`Initiate a New Request (Step ${currentStep + 1}/2)`}
            height="100%"
            onCloseComplete={this.reset}
            width="x-large"
          >
            {currentStep === 0 && <Form ref={this.formRef} data={data} />}
            {currentStep === 1 && <FileUploader />}
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

NewRequestDialog.propTypes = {
  // children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  id: PropTypes.string,
  isNewRequest: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeStep: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NewRequestDialog;
