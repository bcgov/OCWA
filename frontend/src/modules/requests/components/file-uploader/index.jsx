import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import FileItem from '../../containers/file-item';
import * as styles from './styles.css';

class FileUploader extends React.Component {
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
    const { isUploading } = this.state;
    const { onDrop } = this.props;
    const { files } = event.dataTransfer;
    const payload = [];
    event.preventDefault();

    if (!isUploading) {
      this.setState({
        isDragging: false,
      });

      for (let i = 0; i < files.length; i++) {
        payload.push(files[i]);
      }

      onDrop(payload);
    }
  };

  render() {
    const { data, isUploading } = this.props;
    const { isDragging } = this.state;

    return (
      <div className={cx('file-uploader', styles.container)}>
        {!data.length && (
          <div
            className={cx('file-uploader-drop-zone', styles.dropZone, {
              [styles.dropZoneDragOver]: isDragging,
            })}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
          >
            <div className={cx('file-uploader-text', styles.uploadText)}>
              {!isUploading && (
                <div>{isDragging ? 'Drop files here' : 'Drag files here'}</div>
              )}
            </div>
          </div>
        )}
        <div className="file-uploader-list">
          {data.map(id => <FileItem key={id} id={id} />)}
        </div>
      </div>
    );
  }
}

FileUploader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  isUploading: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default FileUploader;
