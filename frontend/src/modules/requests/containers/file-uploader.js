import { connect } from 'react-redux';
import difference from 'lodash/difference';
import get from 'lodash/get';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader/uploader';
import { uploadFile } from '../actions';

const mapStateToProps = (state, props) => {
  const ids = keys(state.requests.files);
  const files = get(props, 'data.files', []);
  const data = difference(ids, files);
  const isUploading = data.length > 0;

  return {
    data,
    requestId: props.data._id,
    files,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadFile,
})(FileUploader);
