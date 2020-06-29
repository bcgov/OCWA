import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ky from 'ky';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  onSubmit = async event => {
    event.preventDefault();

    const credentials = {
      json: {
        email: this.email.current.value,
        password: this.password.current.value,
      },
    };
    await ky.post('/auth/register', credentials);
    await ky.post('/auth', credentials).json();
  };

  render() {
    const { onClose, open } = this.props;

    return (
      <ModalTransition>
        {open && (
          <ModalDialog heading="Register" onClose={onClose}>
            <form onSubmit={this.onSubmit}>
              <div>
                <input
                  required
                  placeholder="Email"
                  ref={this.email}
                  type="email"
                />
              </div>
              <div>
                <input
                  required
                  placeholder="Password"
                  ref={this.password}
                  type="password"
                />
              </div>
              <div>
                <Button onClick={onClose}>Cancel</Button>
                <Button appearance="primary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </ModalDialog>
        )}
      </ModalTransition>
    );
  }
}

Register.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Register;
