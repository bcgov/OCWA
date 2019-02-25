import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Files from '../../containers/files';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

function RequestDetails({ data }) {
  const files = get(data, 'files', []);
  const supportingFiles = get(data, 'supportingFiles', []);

  if (isEmpty(data)) {
    return 'Loading...';
  }

  return (
    <React.Fragment>
      <div className={styles.section}>
        <h4>Purpose</h4>
        <p id="request-purpose">
          {data.purpose || 'No purpose has been added yet.'}
        </p>
      </div>
      <div id="request-export-files" className={styles.section}>
        <div className={styles.sectionHeader}>Output Files</div>
        <div className={styles.sectionContent}>
          {files.length > 0 && (
            <Files
              showDownloadButton
              ids={files}
              fileStatus={data.fileStatus}
            />
          )}
          {!files.length && (
            <div className={styles.empty}>No files have been added</div>
          )}
        </div>
      </div>
      <div id="request-support-files" className={styles.section}>
        <div className={styles.sectionHeader}>Support Files</div>
        <div className={styles.sectionContent}>
          {supportingFiles.length > 0 && (
            <Files showDownloadButton ids={supportingFiles} />
          )}
          {!supportingFiles.length && (
            <div className={styles.empty}>No files have been added</div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

RequestDetails.propTypes = {
  data: RequestSchema,
};

RequestDetails.defaultProps = {
  data: {},
};

export default RequestDetails;
