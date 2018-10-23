import * as React from 'react';
import cx from 'classnames';
import tus from 'tus-js-client';

import * as styles from './styles.css';

class FileUploader extends React.Component {
  state = {
    isDragging: false,
    error: null,
  };

  upload = file => {
    const { onUploadSuccess } = this.props;
    this.setState({
      error: null,
    });
    const upload = new tus.Upload(file, {
      endpoint: 'http://localhost:1080/files/',
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: error => this.setState({ error }),
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, `${percentage} %`);
      },
      onSuccess: () => onUploadSuccess(upload),
    });

    // Start the upload
    upload.start();
  };

  onDragLeave = event => {
    event.preventDefault();
    this.setState({ isDragging: false });
  };

  onDragOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    this.setState({ isDragging: true });
  };

  onDrop = event => {
    const { files } = event.dataTransfer;
    event.preventDefault();

    this.setState({
      isDragging: false,
    });

    this.upload(files[0]);
  };

  render() {
    const { isDragging, error } = this.state;
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
          {isError && <div>Failed To Upload</div>}
          {isDragging ? 'Drop' : 'Drag'} files here
        </div>
      </div>
    );
  }
}

export default FileUploader;
