import { connect } from 'react-redux';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadFile } from '../actions';

const mapStateToProps = state => {
  const data = keys(state.requests.files);
  const isUploading = data.length > 0;

  return {
    data,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadFile,
})(FileUploader);
