import * as React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { uid } from 'react-uid';

import EditField from './edit-field';
import Files from '../../containers/files';
import { RequestSchema } from '../../types';
import { requestFields } from '../../utils';
import * as styles from './styles.css';

function RequestDetails({ data, isEditing, onSave }) {
  const files = get(data, 'files', []);
  const supportingFiles = get(data, 'supportingFiles', []);
  const requestDetails = requestFields.map(d => ({
    name: d.name,
    value: get(data, d.value),
    key: d.value,
  }));

  if (isEmpty(data)) {
    return 'Loading...';
  }

  return (
    <React.Fragment>
      <div className={styles.section}>
        {requestDetails
          .filter(d => (isEditing ? true : !isEmpty(d.value)))
          .map(d => (
            <EditField
              key={uid(d)}
              data={d}
              isEditing={isEditing}
              onSave={onSave}
            />
          ))}
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
  isEditing: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

RequestDetails.defaultProps = {
  data: {},
};

export default RequestDetails;
