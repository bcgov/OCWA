import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import PropTypes from 'prop-types';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

import Form from './form';
import FileUploader from '../../containers/file-uploader';

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
    const { currentStep, data, files } = this.props;

    if (currentStep === 0) {
      const formValues = this.validateForm();

      if (formValues) {
        this.save({ ...data, ...formValues, files }, true);
      }
    } else if (currentStep === 1) {
      this.save(
        {
          ...data,
          files,
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
    const { data, files, sendAction } = this.props;
    const payload = {
      ...data,
      files: [...data.files, ...files],
    };
    sendAction('onSubmit', payload, { quitEditing: true });
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
    const { currentStep, isCreating, isUploading, onCancel } = this.props;
    const isDisabled = isCreating || isUploading;

    return (
      <ModalFooter>
        <Button
          appearance="default"
          isDisabled={isDisabled}
          onClick={this.onSaveAndClose}
        >
          Save and Close
        </Button>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button
            appearance="default"
            isDisabled={isDisabled}
            onClick={onCancel}
          >
            Cancel
          </Button>
          {currentStep === 0 && (
            <Button
              isDisabled={isDisabled}
              appearance="primary"
              onClick={this.onAddFiles}
            >
              {isCreating ? 'Creating...' : 'Add Files'}
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              appearance="primary"
              isDisabled={isDisabled}
              onClick={this.onSubmit}
            >
              Submit for Review
            </Button>
          )}
        </ButtonGroup>
      </ModalFooter>
    );
  };

  render() {
    const { currentStep, data, open, onUploadFile, isUploading } = this.props;

    return (
      <ModalTransition>
        {open && (
          <Modal
            autoFocus
            footer={this.renderFooter}
            heading={`Initiate a New Request (Step ${currentStep + 1}/2)`}
            onCloseComplete={this.reset}
            width="x-large"
          >
            {currentStep === 0 && <Form ref={this.formRef} data={data} />}
            {currentStep === 1 && (
              <FileUploader isUploading={isUploading} onDrop={onUploadFile} />
            )}
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
  files: PropTypes.arrayOf(PropTypes.string).isRequired,
  isNewRequest: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeStep: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onUploadFile: PropTypes.func.isRequired,
};

export default NewRequestDialog;
