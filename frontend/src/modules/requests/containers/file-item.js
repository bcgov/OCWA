import { connect } from 'react-redux';
import at from 'lodash/at';
import compact from 'lodash/compact';
import get from 'lodash/get';
import head from 'lodash/head';
import isNumber from 'lodash/isNumber';

import FileItem from '../components/file-uploader/file-item';

const mapStateToProps = (state, { id }) => {
  const uploadStatus = get(state, `requests.uploads.${id}`, 'queued');
  const results = at(state.requests, [`files.${id}`, `supportingFiles.${id}`]);
  const data = head(compact(results)) || {};

  return {
    data,
    progress: uploadStatus,
    uploadStatus: isNumber(uploadStatus) ? 'uploading' : uploadStatus,
  };
};

export default connect(mapStateToProps)(FileItem);
