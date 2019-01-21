import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Button, { ButtonGroup } from '@atlaskit/button';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import mergeWith from 'lodash/mergeWith';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

import Form from './form';
import FileUploader from '../file-uploader';

const defaultFormValues = {
  name: '',
  author: '',
  confidentiality: '',
  freq: '',
  purpose: '',
  selectionCriteria: '',
  variableDescriptions: '',
};

class NewRequestDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    // Store temp form variables here to keep false negative validation errors
    this.state = defaultFormValues;
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
    const { currentStep, data } = this.props;

    if (currentStep === 0) {
      const formValues = this.validateForm();
      if (formValues) {
        this.save({ ...data, ...formValues });
      }
    } else {
      this.save(data);
    }
  };

  onSaveAndClose = () => {
    const { currentStep, data } = this.props;

    if (currentStep === 0) {
      const formValues = this.validateForm();

      if (formValues) {
        this.save({ ...data, ...formValues }, true);
      }
    } else if (currentStep === 1) {
      this.save(data, true);
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
    const { isNewRequest, sendAction } = this.props;

    if (isNewRequest) {
      this.setState(payload);
      sendAction('onCreate', payload, { quitEditing, nextStep });
    } else {
      sendAction('onSave', payload, { quitEditing, nextStep });
    }
  };

  onReset = () => {
    const { onReset } = this.props;
    this.setState(defaultFormValues, onReset);
  };

  renderFooter = () => {
    const {
      currentStep,
      data,
      isCreating,
      isSaving,
      isUploading,
      onCancel,
      open,
    } = this.props;
    const isDisabled = isCreating || isUploading || isSaving || !open;
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
            isDisabled={isCreating || isSaving || isUploading}
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

  render() {
    const { currentStep, data, open } = this.props;
    const formData = mergeWith({}, data, this.state, (objValue, srcValue) => {
      if (isEmpty(objValue)) {
        return srcValue;
      }

      return objValue;
    });

    return (
      <ModalTransition>
        {open && (
          <Modal
            autoFocus={false}
            footer={this.renderFooter}
            heading={`Initiate a New Request (Step ${currentStep + 1}/2)`}
            onCloseComplete={this.onReset}
            width="x-large"
          >
            <div id="request-form-container">
              {currentStep === 0 && <Form ref={this.formRef} data={formData} />}
              {currentStep === 1 && <FileUploader data={data} />}
            </div>
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
  isNewRequest: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NewRequestDialog;
