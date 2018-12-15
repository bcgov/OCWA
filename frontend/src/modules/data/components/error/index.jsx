import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import * as styles from './styles.css';

function ErrorComponent({ data }) {
  return (
    <div className={styles.container}>
      <div>
        <div>
          <ErrorIcon size="xlarge" primaryColor={colors.R500} />
        </div>
        <h3>Something broke!</h3>
        <p>Send the following to a developer to report</p>
        <pre style={{ color: colors.R500 }}>{data.message}</pre>
        <br />
        {window.__REDUX_DEVTOOLS_EXTENSION__ && (
          <Button
            appearance="danger"
            onClick={() => window.__REDUX_DEVTOOLS_EXTENSION__.open()}
          >
            Show Redux DevTool
          </Button>
        )}
        <h5>Stack trace:</h5>
        <pre style={{ borderColor: colors.R500 }}>{data.info}</pre>
      </div>
    </div>
  );
}

ErrorComponent.propTypes = {
  data: PropTypes.shape({
    message: PropTypes.string,
    info: PropTypes.string,
  }),
};

export default ErrorComponent;
