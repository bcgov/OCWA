import { connect } from 'react-redux';
import get from 'lodash/get';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadSupportingFile } from '../actions';

const mapStateToProps = (state, props) => {
  const data = keys(state.requests.supportingFiles);
  const isUploading = data.length > 0;

  return {
    data,
    files: get(props, 'data.supportingFiles', []),
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadSupportingFile,
})(FileUploader);
