import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Spinner from '@atlaskit/spinner';

import FileItem from './file-item';
import { FileSchema } from '../../types';
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

    event.preventDefault();

    if (!isUploading) {
      this.setState({
        isDragging: false,
      });

      onDrop(files[0]);
    }
  };

  render() {
    const { data, isUploading } = this.props;
    const { isDragging } = this.state;

    return (
      <React.Fragment>
        {!data.length && (
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
                {!isUploading && (
                  <div>
                    {isDragging ? 'Drop files here' : 'Drag files here'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div>{data.map(d => <FileItem key={d.id} data={d} />)}</div>
      </React.Fragment>
    );
  }
}

FileUploader.propTypes = {
  data: PropTypes.arrayOf(FileSchema).isRequired,
  isUploading: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default FileUploader;
