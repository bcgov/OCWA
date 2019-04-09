import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import Button from '@atlaskit/button';
import cx from 'classnames';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Spinner from '@atlaskit/spinner';
import UploadIcon from '@atlaskit/icon/glyph/upload';
import { colors } from '@atlaskit/theme';

import * as styles from './styles.css';
import FileItem from '../../containers/file-item';

class Uploader extends React.Component {
  state = {
    isDragging: false,
  };

  onDragOut = event => {
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
    const { filesKey, onUpload } = this.props;
    const payload = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      if (file.size > 0) {
        payload.push(files[i]);
      }
    }

    if (files.length > 0) {
      onUpload(payload, filesKey);
    }
  };

  render() {
    const { isDragging } = this.state;
    const { data, fetchStatus, filesKey, uploadText } = this.props;
    const uploadButton = (
      <div
        className={cx(
          styles.uploadButtonContainer,
          'file-uploader-button-container'
        )}
      >
        <Button className="file-uploader-button" iconBefore={<UploadIcon />}>
          Upload Files
        </Button>
        <input
          multiple
          className={cx(styles.uploadInput, 'file-uploader-input')}
          type="file"
          onChange={this.onFileInputChange}
        />
      </div>
    );

    return (
      <div className={styles.uploadContainer}>
        <div
          className={cx('file-uploader-drop-zone', styles.dropZone, {
            [styles.dropZoneDragOver]: isDragging,
          })}
          onDragExit={this.onDragOut}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          {isDragging && (
            <div className={styles.dragOver}>
              <div>
                <ArrowDownCircleIcon
                  primaryColor="white"
                  secondaryColor={colors.B500}
                  size="large"
                />
                <div>Drop your files here</div>
              </div>
            </div>
          )}
          {!data.length && (
            <div className={cx('file-uploader-text', styles.uploadText)}>
              <div>
                <div>
                  <CopyIcon primaryColor="#ccc" size="xlarge" />
                </div>
                <p>{isDragging ? 'Drop your files' : uploadText}</p>
                <small>Or</small>
                {uploadButton}
              </div>
            </div>
          )}
          {fetchStatus === 'loading' && (
            <div className={styles.loading}>
              <Spinner />
            </div>
          )}
          {fetchStatus !== 'loading' &&
            data.length > 0 && (
              <div
                className={cx('file-uploader-list', styles.fileUploaderList)}
              >
                <div className={styles.uploadQueueList}>
                  {data.map(id => (
                    <FileItem key={id} id={id} filesKey={filesKey} />
                  ))}
                </div>
                <div className={styles.inlineUploadButton}>{uploadButton}</div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

Uploader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchStatus: PropTypes.oneOf(['idle', 'loading', 'loaded', 'failed'])
    .isRequired,
  filesKey: PropTypes.string.isRequired, // Which key to look up on the request object
  isUploading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploadText: PropTypes.string.isRequired,
};

export default Uploader;
