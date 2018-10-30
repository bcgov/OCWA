import * as React from 'react';
import Button from '@atlaskit/button';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

function Auth({ fetchStatus, isAuthenticated }) {
  return (
    <ModalTransition>
      {!isAuthenticated && (
        <ModalDialog heading="Authenticating...">
          {fetchStatus === 'loading' && 'Loading...'}
          {fetchStatus === 'failed' && (
            <Button appearance="primary" href="/login">
              Login
            </Button>
          )}
        </ModalDialog>
      )}
    </ModalTransition>
  );
}

export default Auth;
