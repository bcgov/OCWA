import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import cx from 'classnames';
import UploadIcon from '@atlaskit/icon/glyph/upload';

import * as styles from './styles.css';
import Files from '../../containers/files';
import FileItem from '../../containers/file-item';

class Uploader extends React.Component {
  state = {
    isDragging: false,
  };

  onDragLeave = event => {
    event.preventDefault();
    this.setState({ isDragging: false });
  };

  onDragOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // eslint-disable-line

    this.setState({ isDragging: true });
  };

  onDrop = event => {
    const { isUploading } = this.props;
    const { files } = event.dataTransfer;
    event.preventDefault();

    if (!isUploading) {
      this.setState({
        isDragging: false,
      });

      this.uploadFiles(files);
    }
  };

  onFileInputChange = event => {
    event.preventDefault();

    this.uploadFiles(event.target.files);
  };

  uploadFiles = files => {
    const { onUpload } = this.props;
    const payload = [];

    for (let i = 0; i < files.length; i += 1) {
      payload.push(files[i]);
    }

    if (files.length > 0) {
      onUpload(payload);
    }
  };

  render() {
    const { isDragging } = this.state;
    const { data, files, uploadText } = this.props;

    return (
      <div className={styles.uploadContainer}>
        <div
          className={cx('file-uploader-drop-zone', styles.dropZone, {
            [styles.dropZoneDragOver]: isDragging,
          })}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          <div className={cx('file-uploader-text', styles.uploadText)}>
            <div>
              <p>
                Make sure you save your request after uploading to enable
                submission.
              </p>
              <p>{isDragging ? 'Drop your files' : uploadText}</p>
              <small>Or</small>
              <Button
                id="file-uploader-button"
                className={styles.uploadButton}
                iconBefore={<UploadIcon />}
              >
                Upload Files
                <input
                  multiple
                  id="file-uploader-input"
                  type="file"
                  onChange={this.onFileInputChange}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className={cx('file-uploader-list', styles.fileUploaderList)}>
          {data.length > 0 && (
            <div className={styles.uploadQueueList}>
              <h5>Upload Queue</h5>
              {data.map(id => <FileItem key={id} id={id} />)}
            </div>
          )}
          {files.length > 0 && (
            <div className={styles.loadedFiles}>
              <h5>Request Files</h5>
              <Files ids={files} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Uploader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  isUploading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploadText: PropTypes.string.isRequired,
};

export default Uploader;
