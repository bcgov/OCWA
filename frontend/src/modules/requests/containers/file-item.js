import { connect } from 'react-redux';
import FileItem from '../components/file-uploader/file-item';
import isNumber from 'lodash/isNumber';

const mapStateToProps = (state, props) => {
  const uploadStatus = state.requests.uploads[props.id];
  return {
    data: state.requests.files[props.id],
    uploadStatus: isNumber(uploadStatus) ? 'uploading' : uploadStatus,
  };
};

export default connect(mapStateToProps)(FileItem);
