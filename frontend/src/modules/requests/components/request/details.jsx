import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Files from '../../containers/files';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

function RequestDetails({ data }) {
  const files = get(data, 'files', []);
  const supportFiles = get(data, 'supportFiles', []);

  if (isEmpty(data)) {
    return 'Loading...';
  }

  return (
    <React.Fragment>
      <div className={styles.section}>
        <h4>Purpose</h4>
        <p id="request-purpose">{data.purpose}</p>
      </div>
      <div id="request-export-files" className={styles.section}>
        <div className={styles.sectionHeader}>Export Files</div>
        <div className={styles.sectionContent}>
          {files.length > 0 && (
            <Files ids={files} fileStatus={data.fileStatus} />
          )}
          {!files.length && (
            <div className={styles.empty}>No files have been added</div>
          )}
        </div>
      </div>
      {supportFiles.length > 0 && (
        <div id="request-support-files" className={styles.section}>
          <div className={styles.sectionHeader}>Support Files</div>
          <div className={styles.sectionContent}>
            <Files ids={supportFiles} />
          </div>
        </div>
      )}
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
