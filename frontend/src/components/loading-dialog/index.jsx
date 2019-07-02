import * as React from 'react';
import PropTypes from 'prop-types';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function LoadingDialog({ open, title, text }) {
  return (
    <ModalTransition>
      {open && (
        <ModalDialog heading={title}>
          <div className={styles.container}>
            <Spinner size="large" />
            {text && <p>{text}</p>}
          </div>
        </ModalDialog>
      )}
    </ModalTransition>
  );
}

LoadingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
};

LoadingDialog.defaultProps = {
  text: '',
};

export default LoadingDialog;
