import { connect } from 'react-redux';
import withRequest from '@src/modules/data/components/data-request';
import get from 'lodash/get';
import { removeFile } from '@src/modules/requests/actions';

import { fetchFiles } from '../actions';
import FilesTable from '../components/files-table';
import { filesListSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const fetchStatus = get(state, 'data.fetchStatus.dataTypes.files', 'idle');
  const data = props.ids.map(id =>
    get(state, `data.entities.files.${id}`, { id })
  );

  return {
    data: fetchStatus === 'loaded' ? data : [],
    fetchStatus,
  };
};

export default connect(mapStateToProps, {
  initialRequest: ({ ids = [], id }) =>
    fetchFiles({
      url: `/api/v1/files?request_id=${id}&ids=${ids.join(',')}`,
      schema: filesListSchema,
    }),
  onRemove: removeFile,
})(withRequest(FilesTable));
