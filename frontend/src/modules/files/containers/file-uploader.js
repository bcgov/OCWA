import { connect } from 'react-redux';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import keys from 'lodash/keys';
import union from 'lodash/union';
import values from 'lodash/values';

import FileUploader from '../components/file-uploader';
import { uploadFile } from '../actions';

const mapStateToProps = (state, props) => {
  const { filesToDelete } = state.requests.viewState;
  const ids = keys(state.files.entities)
    .map(id => {
      const file = get(state, `files.entities.${id}`, { id });
      // Unfortunately there is a temp ID and it can change, so we're
      // reassigning it for the list's purposes
      return {
        ...file,
        id,
      };
    })
    .filter(d => d.filesKey === props.filesKey)
    .map(d => d.id);
  const files = get(props, ['data', props.filesKey], []);
  const data = union(files, ids).filter(id => !filesToDelete.includes(id));
  const uploadStatuses = values(state.files.entities);
  const isUploading = uploadStatuses.some(isNumber);

  return {
    data,
    requestId: props.data._id,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  onUpload: uploadFile,
})(FileUploader);
