import { connect } from 'react-redux';
import keys from 'lodash/keys';

import FileUploader from '../components/file-uploader';

const mapStateToProps = state => {
  const data = keys(state.requests.uploads);

  return {
    data,
  };
};

export default connect(mapStateToProps)(FileUploader);
