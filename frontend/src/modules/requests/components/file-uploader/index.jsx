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
    const tabs = [
      {
        label: 'Export Files',
        content: <FilesUploader uploadText="Drag Files Here" />,
      },
      {
        label: 'Supporting Files',
        content: (
          <SupportingFilesUploader uploadText="Drag Support Files Here" />
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

export default FileUploader;
