import { connect } from 'react-redux';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadSupportingFile } from '../actions';

const mapStateToProps = state => {
  const data = keys(state.requests.supportingFiles);
  const isUploading = data.length > 0;

  return {
    data,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadSupportingFile,
})(FileUploader);
