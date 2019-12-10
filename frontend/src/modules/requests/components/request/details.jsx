import * as React from 'react';
import PropTypes from 'prop-types';
import { Code } from 'react-content-loader';
import isEmpty from 'lodash/isEmpty';
import Files from '@src/modules/files/containers/files';
import FileUploader from '@src/modules/files/containers/file-uploader';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { Prompt } from 'react-router-dom';
import { uid } from 'react-uid';
import { zone } from '@src/services/config';
import { _e } from '@src/utils';

import EditField from './edit-field';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

function RequestDetails({
  data,
  duplicateFiles,
  fetchForm,
  fields,
  id,
  isEditing,
  isLoading,
  onSave,
}) {
  const files = get(data, 'files', []);
  const supportingFiles = get(data, 'supportingFiles', []);
  console.log(fields);
  const requestDetails = fields.map(d => ({
    name: d.label,
    type: d.type,
    value: get(data, d.key, ''),
    key: d.key,
    isRequired: d.validate && d.validate.required,
  }));
  const uploadData = merge({}, data, duplicateFiles);

  React.useEffect(() => {
    if (data.formName && fields.length <= 0) {
      fetchForm({ id: data.formName });
    }
  }, [data]);

  if (isLoading && !data._id) {
    return (
      <React.Fragment>
        <Code />
        <Code />
        <Code />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Prompt
        when={isEditing}
        message="Are you sure you want to leave this page before finishing your edits?"
      />
      <div className={styles.section}>
        {requestDetails.map(d => (
          <EditField
            key={uid(d)}
            data={d}
            isEditing={isEditing}
            onSave={onSave}
          />
        ))}
      </div>
      {(data.exportType === 'data' || !data.exportType) && (
        <React.Fragment>
          <div id="request-export-files" className={styles.section}>
            <div className={styles.sectionHeader}>
              {_e('{Files} Files', data.type)}
              {isEditing && ' (Drop files here to upload)'}
            </div>
            <div className={styles.sectionContent}>
              {!isEditing && (
                <Files
                  showDownloadButton
                  id={id}
                  ids={files}
                  fileStatus={data.fileStatus}
                />
              )}
              {isEditing && (
                <FileUploader
                  data={uploadData}
                  filesKey="files"
                  id={id}
                  uploadText="Upload files you wish to request for output"
                />
              )}
            </div>
          </div>
          <div id="request-support-files" className={styles.section}>
            <div className={styles.sectionHeader}>
              Support Files
              {isEditing && ' (Drop files here to upload)'}
            </div>
            <div className={styles.sectionContent}>
              {!isEditing && (
                <Files showDownloadButton id={id} ids={supportingFiles} />
              )}
              {isEditing && (
                <FileUploader
                  data={uploadData}
                  id={id}
                  filesKey="supportingFiles"
                  uploadText="Upload any files to help support your request"
                />
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

RequestDetails.propTypes = {
  data: RequestSchema,
  duplicateFiles: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.string),
    supportingFiles: PropTypes.arrayOf(PropTypes.string),
  }),
  fetchForm: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

RequestDetails.defaultProps = {
  data: {},
  duplicateFiles: {
    files: [],
    supportingFiles: [],
  },
};

export default RequestDetails;
