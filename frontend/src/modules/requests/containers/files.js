import { connect } from 'react-redux';
import withRequest from '@src/modules/data/components/data-request';
import get from 'lodash/get';

import { downloadFile, fetchFiles, removeFile } from '../actions';
import FilesTable from '../components/files-table';
import { filesListSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const fetchStatus = get(state, 'data.fetchStatus.dataTypes.files', 'idle');
  const data = props.ids.map(id => get(state, `data.entities.files.${id}`, {}));

  return {
    data: fetchStatus === 'loaded' ? data : [],
    fetchStatus,
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ ids = [] }) =>
    fetchFiles({
      url: `/api/v1/files?ids=${ids.join(',')}`,
      schema: filesListSchema,
    }),
  onDownload: downloadFile,
  onRemove: removeFile,
})(withRequest(FilesTable));
