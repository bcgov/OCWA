import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import PropTypes from 'prop-types';
import Modal, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

import Form from './form';

class NewRequestDialog extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  onValidate = () => {
    const { isNewRequest, onCreate, onSave } = this.props;
    const { isInvalid, validFields } = this.formRef.current.validate();

    if (!isInvalid) {
      const payload = validFields.reduce(
        (prev, field) => ({
          ...prev,
          [field.name]: field.value,
        }),
        {}
      );

      if (isNewRequest) {
        onCreate(payload);
      } else {
        onSave(payload);
      }
    }
  };

  renderFooter = () => {
    const { onCancel } = this.props;

    return (
      <ModalFooter>
        <Button appearance="default" onClick={this.onValidate}>
          Save and Close
        </Button>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button appearance="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button appearance="primary">Add Files</Button>
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
            <Form ref={this.formRef} data={data} />
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
  isNewRequest: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NewRequestDialog;
