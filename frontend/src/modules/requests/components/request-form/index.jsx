import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import Form from './form';
import * as styles from './styles.css';

class NewRequestDialog extends React.PureComponent {
  onSubmit = (data, files) => {
    const { history, sendAction } = this.props;
    sendAction('onCreate', data, { history, files });
  };

  render() {
    const { helpURL, isCreating, location } = this.props;

    return (
      <Page>
        <div id="request-form-container" className={styles.container}>
          <Grid>
            <GridColumn medium={12}>
              <Form
                data={location.state || {}}
                helpURL={helpURL}
                isCreating={isCreating}
                onSubmit={this.onSubmit}
              />
            </GridColumn>
          </Grid>
        </div>
      </Page>
    );
  }
}

NewRequestDialog.propTypes = {
  helpURL: PropTypes.string,
  history: PropTypes.object.isRequired,
  isCreating: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  sendAction: PropTypes.func.isRequired,
};

NewRequestDialog.defaultProps = {
  helpURL: null,
};

export default NewRequestDialog;
