import { connect } from 'react-redux';
import isNumber from 'lodash/isNumber';

import FileUploader from '../components/file-uploader';

const mapStateToProps = state => {
  const ids = Object.keys(state.requests.files);
  const states = Object.keys(state.requests.uploads).map(
    id => state.requests.uploads[id]
  );
  const data = ids.map(id => state.requests.files[id]);

  return {
    data,
    isUploading: states.some(isNumber),
  };
};

export default connect(mapStateToProps)(FileUploader);
