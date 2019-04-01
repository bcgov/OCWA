import { connect } from 'react-redux';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import keys from 'lodash/keys';
import union from 'lodash/union';
import values from 'lodash/values';
import withRequest from '@src/modules/data/components/data-request';

import FileUploader from '../components/file-uploader';
import { fetchFiles, uploadFile } from '../actions';
import { filesListSchema } from '../schemas';

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
  const fileIds = get(props, ['data', props.filesKey], []);
  const data = union(fileIds, ids).filter(id => !filesToDelete.includes(id));
  const uploadStatuses = values(state.files.entities);
  const isUploading = uploadStatuses.some(isNumber);
  const fetchStatus = get(state, 'data.fetchStatus.dataTypes.files', 'idle');

  return {
    data,
    fetchStatus,
    ids: fileIds,
    requestId: props.data._id,
    isUploading,
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ ids = [] }) =>
    fetchFiles({
      url: `/api/v1/files?ids=${ids.join(',')}`,
      schema: filesListSchema,
    }),
  onUpload: uploadFile,
})(withRequest(FileUploader));
