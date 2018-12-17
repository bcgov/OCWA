import { connect } from 'react-redux';
import get from 'lodash/get';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadFile } from '../actions';

const mapStateToProps = (state, props) => {
  const data = keys(state.requests.files);
  const isUploading = data.length > 0;

  return {
    data,
    files: get(props, 'data.files', []),
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadFile,
})(FileUploader);
