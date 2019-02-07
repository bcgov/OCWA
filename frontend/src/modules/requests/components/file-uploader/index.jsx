import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from '@atlaskit/tabs';

import FilesUploader from '../../containers/file-uploader';
import { RequestSchema } from '../../types';
import SupportingFilesUploader from '../../containers/supporting-files-uploader';
import * as styles from './styles.css';

class FileUploader extends React.Component {
  state = {
    tab: 0,
  };

  onSelectTab = (tab, index) => {
    this.setState({ tab: index });
  };

  render() {
    const { tab } = this.state;
    const { data } = this.props;
    const tabs = [
      {
        label: <span id="file-upload-tab-output">Output Files</span>,
        content: (
          <FilesUploader
            data={data}
            uploadText="Drag Output Files from your computer here"
          />
        ),
      },
      {
        label: <span id="file-upload-tab-support">Supporting Files</span>,
        content: (
          <SupportingFilesUploader
            data={data}
            uploadText="Drag Supporting Files from your computer here"
          />
        ),
      },
    ];

    return (
      <div className={cx('file-uploader', styles.container)}>
        <nav className={styles.nav}>
          <Tabs tabs={tabs} selected={tab} onSelect={this.onSelectTab} />
        </nav>
      </div>
    );
  }
}

FileUploader.propTypes = {
  data: RequestSchema.isRequired,
};

export default FileUploader;
