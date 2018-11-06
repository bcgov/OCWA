import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import cx from 'classnames';
import { ModalFooter } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import tus from 'tus-js-client';
import { getSession } from '@src/services/auth';

import * as styles from './styles.css';

class FileUploader extends React.Component {
  state = {
    isDragging: false,
    isUploading: false,
    error: null,
    progress: 0,
  };

  upload = async file => {
    const token = await getSession();
    const upload = new tus.Upload(file, {
      endpoint: '/api/v1/files',
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.name,
        filetype: file.type,
        lastModified: file.lastModified,
        jwt: token,
      },
      onError: this.onError,
      onProgress: this.onProgress,
      onSuccess: this.onSuccess.bind(null, file),
    });

    // Start the upload
    this.setState(
      {
        error: null,
        progress: 0,
        isUploading: true,
      },
      () => upload.start()
    );
  };

  onError = error => {
    this.setState({ error, isUploading: false, progress: 0 });

    setTimeout(() => {
      this.setState({
        error: null,
        progress: 0,
      });
    }, 5000);
  };

  onProgress = (bytesUploaded, bytesTotal) => {
    const progress = (bytesUploaded / bytesTotal * 100).toFixed(2);
    this.setState({ progress });
  };

  onSuccess = file => {
    const { onUploadSuccess } = this.props;
    this.setState(
      {
        isUploading: false,
        progress: 100,
      },
      () => {
        onUploadSuccess(file);
      }
    );
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
    const { isUploading } = this.state;
    const { files } = event.dataTransfer;
    event.preventDefault();

    if (!isUploading) {
      this.setState({
        isDragging: false,
      });

      this.upload(files[0]);
    }
  };

  renderFooter = () => (
    <ModalFooter>
      <Button appearance="default" onClick={this.onToggleDialog}>
        Save and Close
      </Button>
      <div style={{ flex: 1 }} />
      <ButtonGroup>
        <Button
          appearance="default"
          onClick={this.onChangeStep(0)}
          style={{ marginRight: 4 }}
        >
          Previous Step
        </Button>
        <Button appearance="primary" onClick={this.onSubmit}>
          Submit
        </Button>
      </ButtonGroup>
    </ModalFooter>
  );

  render() {
    const { isDragging, isUploading, error, progress } = this.state;
    const isError = Boolean(error);

    return (
      <div className={styles.uploadContainer}>
        <div
          className={cx(styles.dropZone, {
            [styles.dropZoneDragOver]: isDragging,
          })}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          <div className={styles.uploadText}>
            {isError && <div>Failed To Upload</div>}
            {isUploading && (
              <div>
                <Spinner size="medium" />
                <p>{`${progress}% Uploaded`}</p>
              </div>
            )}
            {!isUploading && (
              <div>{isDragging ? 'Drop files here' : 'Drag files here'}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

FileUploader.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default FileUploader;
