import * as React from 'react';
import Button from '@atlaskit/button';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

function Auth({ fetchStatus, isAuthenticated }) {
  const isFailed = fetchStatus === 'failed';
  return (
    <ModalTransition>
      {!isAuthenticated && (
        <ModalDialog appearance={isFailed ? 'warning' : null} width="small">
          <div className={styles.content}>
            {!/(loaded|failed)/.test(fetchStatus) && (
              <div id="app-auth-loading">
                <p>Checking authentication...</p>
                <Spinner size="medium" />
              </div>
            )}
            {fetchStatus === 'loaded' && (
              <div id="app-auth-loaded">
                <p>Success!</p>
              </div>
            )}
            {isFailed && (
              <div id="app-auth-failed">
                <p>
                  There was an error authenticating.
                  <br />
                  Please sign in.
                </p>
                <Button
                  appearance="warning"
                  href="/login"
                  id="app-auth-login-button"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </ModalDialog>
      )}
    </ModalTransition>
  );
}

export default Auth;
