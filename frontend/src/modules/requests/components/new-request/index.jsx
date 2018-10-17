import * as React from 'react';
import Button from '@atlaskit/button';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

class NewRequest extends React.Component {
  state = {
    open: false,
  };

  onToggleDialog = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  render() {
    const { open } = this.state;
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
              <div
                style={{
                  width: '100%',
                  height: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Upload files
              </div>
            </Modal>
          )}
        </ModalTransition>
      </React.Fragment>
    );
  }
}

export default NewRequest;
