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
    const { isNewRequest, onSave } = this.props;
    const { isInvalid, validFields } = this.formRef.current.validate();

    console.log(isNewRequest);
    if (!isInvalid) {
      console.log(
        validFields.reduce(
          (prev, field) => ({
            ...prev,
            [field.name]: field.value,
          }),
          {}
        )
      );
    }
  };

  renderFooter = () => {
    return (
      <ModalFooter>
        <Button appearance="default" onClick={this.onValidate}>
          Save and Close
        </Button>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button appearance="default" onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button appearance="primary">Add Files</Button>
        </ButtonGroup>
      </ModalFooter>
    );
  };

  render() {
    const { children, currentStep, data, open } = this.props;

    return (
      <ModalTransition>
        {open && (
          <Modal
            autoFocus
            footer={this.renderFooter}
            heading={
              <div>{`Initiate a New Request (Step ${currentStep +
                1}/${React.Children.count(children)})`}</div>
            }
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
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NewRequestDialog;
