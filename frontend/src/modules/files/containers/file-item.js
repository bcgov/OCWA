import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import isNumber from 'lodash/isNumber';
import { removeFile } from '@src/modules/requests/actions';

import FileItem from '../components/file-uploader/file-item';

const mapStateToProps = (state, { id }) => {
  const loadedFileKeyPath = `data.entities.files.${id}`;
  const isUploadedFile = has(state, loadedFileKeyPath);
  const uploadStatus = isUploadedFile
    ? 'loaded'
    : get(state, `files.uploadStatus.${id}`, 'queued');
  const keyPath = isUploadedFile ? loadedFileKeyPath : `files.entities.${id}`;
  const data = get(state, keyPath, {
    fileName: '',
  });

  return {
    data,
    id,
    progress: uploadStatus,
    uploadStatus: isNumber(uploadStatus) ? 'uploading' : uploadStatus,
  };
};

export default connect(mapStateToProps, {
  onRemove: removeFile,
})(FileItem);
