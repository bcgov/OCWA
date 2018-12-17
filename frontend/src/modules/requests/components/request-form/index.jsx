import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Button, { ButtonGroup } from '@atlaskit/button';
import get from 'lodash/get';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

import Form from './form';
import FileUploader from '../file-uploader';

class NewRequestDialog extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  validateForm = () => {
    if (!this.formRef.current) {
      return false;
    }

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

  onSave = () => {
    const { currentStep, data, files } = this.props;

    if (currentStep === 0) {
      const formValues = this.validateForm();
      if (formValues) {
        this.save({ ...data, ...formValues, files });
      }
    } else {
      this.save({
        ...data,
        files,
      });
    }
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
    const formValues = this.validateForm();

    if (formValues) {
      this.save(formValues, false, true);
    }
  };

  onSubmit = () => {
    const { data, sendAction } = this.props;
    sendAction('onSubmit', data, { quitEditing: true });
  };

  save = (payload, quitEditing = false, nextStep = false) => {
    const { files, supportingFiles, isNewRequest, sendAction } = this.props;

    if (isNewRequest) {
      sendAction('onCreate', payload, { quitEditing, nextStep });
    } else {
      sendAction(
        'onSave',
        { ...payload, files, supportingFiles },
        { quitEditing, nextStep }
      );
    }
  };

  renderFooter = () => {
    const {
      currentStep,
      data,
      isCreating,
      isSaving,
      isUploading,
      onCancel,
    } = this.props;
    const isDisabled = isCreating || isUploading;
    const isDraft = data.state === 0;

    return (
      <ModalFooter>
        <ButtonGroup>
          <Button
            appearance="default"
            id="request-form-cancel-button"
            isDisabled={isDisabled}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            appearance="default"
            id="request-form-save-close-button"
            isDisabled={isDisabled}
            onClick={this.onSaveAndClose}
          >
            Save & Close
          </Button>
        </ButtonGroup>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button
            appearance="primary"
            id="request-form-save-button"
            isDisabled={isCreating || isSaving}
            iconBefore={(isCreating || isSaving) && <Spinner />}
            onClick={this.onSave}
          >
            Save
          </Button>
          {currentStep === 0 && (
            <Button
              id="request-form-save-files-button"
              iconAfter={<ArrowRightCircleIcon secondaryColor={colors.B500} />}
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
              id="request-form-submit-button"
              isDisabled={
                isDisabled || isDraft || get(data, 'files.length', 0) <= 0
              }
              onClick={this.onSubmit}
            >
              Submit for Review
            </Button>
          )}
        </ButtonGroup>
      </ModalFooter>
    );
  };

  onClose = () => {
    this.props.onReset();
  };

  render() {
    const { currentStep, data, open } = this.props;

    return (
      <ModalTransition>
        {open && (
          <Modal
            autoFocus
            id="request-form"
            footer={this.renderFooter}
            heading={`Initiate a New Request (Step ${currentStep + 1}/2)`}
            onCloseComplete={this.onClose}
            width="x-large"
          >
            {currentStep === 0 && <Form ref={this.formRef} data={data} />}
            {currentStep === 1 && <FileUploader data={data} />}
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

NewRequestDialog.propTypes = {
  currentStep: PropTypes.number.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.string).isRequired,
  isNewRequest: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  supportingFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
};

export default NewRequestDialog;
