import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import Form from './form';
import * as styles from './styles.css';

class NewRequestDialog extends React.PureComponent {
  onSubmit = data => {
    const { history, sendAction } = this.props;
    sendAction('onCreate', data, { history });
  };

  render() {
    const { isCreating } = this.props;

    return (
      <Page>
        <div id="request-form-container" className={styles.container}>
          <Grid>
            <GridColumn medium={12}>
              <Form isCreating={isCreating} onSubmit={this.onSubmit} />
            </GridColumn>
          </Grid>
        </div>
      </Page>
    );
  }
}

NewRequestDialog.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default NewRequestDialog;
