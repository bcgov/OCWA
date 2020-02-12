import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';
import reportErrorButton from '@src/modules/app/containers/report-error-button';

import * as styles from './styles.css';

const ReportErrorButton = reportErrorButton(props => (
  <Button {...props} appearance="danger">
    Report this Error
  </Button>
));

function ErrorComponent({ data }) {
  return (
    <div className={styles.container}>
      <div>
        <div>
          <ErrorIcon size="xlarge" primaryColor={colors.R500} />
        </div>
        <h3>Something broke!</h3>
        <p>
          This error has been logged. Please report this error if you would like
          to add any additional details.
        </p>
        <pre style={{ color: colors.R500 }}>{data.message}</pre>
        <br />
        <ButtonGroup>
          <ReportErrorButton />
          {window.__REDUX_DEVTOOLS_EXTENSION__ && (
            <Button
              appearance="danger"
              onClick={() => window.__REDUX_DEVTOOLS_EXTENSION__.open()}
            >
              Show Redux DevTool
            </Button>
          )}
        </ButtonGroup>
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
