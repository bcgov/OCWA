import { connect } from 'react-redux';
import difference from 'lodash/difference';
import get from 'lodash/get';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadSupportingFile } from '../actions';

const mapStateToProps = (state, props) => {
  const ids = keys(state.requests.supportingFiles);
  const files = get(props, 'data.supportingFiles', []);
  const data = difference(ids, files);
  const isUploading = data.length > 0;

  return {
    data,
    files,
    fileStatus: {},
    requestId: props.data._id,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadSupportingFile,
})(FileUploader);
