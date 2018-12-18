import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from '@atlaskit/tabs';

import FilesUploader from '../../containers/file-uploader';
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
        label: 'Export Files',
        content: (
          <FilesUploader
            data={data}
            uploadText="Drag Export Files from your computer here"
          />
        ),
      },
      {
        label: 'Supporting Files',
        content: (
          <SupportingFilesUploader
            data={data}
            uploadText="Drag Support Files from your computer here"
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
  data: PropTypes.object.isRequired,
};

export default FileUploader;
