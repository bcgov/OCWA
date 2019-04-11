import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { fetchFiles } from '@src/modules/files/actions';
import { filesListSchema } from '@src/modules/files/schemas';

import { closeDownloads, openDownloads } from '../actions';
import Downloads from '../components/downloads';

const mapStateToProps = (state, props) => {
  const fetchStatus = get(state, 'data.fetchStatus.dataTypes.files', 'idle');
  const ids = get(props, 'request.files', []);
  const data = ids.map(id => get(state, `data.entities.files.${id}`, { id }));

  return {
    data: fetchStatus === 'loaded' ? data : [],
    selectedRequestId: state.download.viewState.selectedRequest,
    fetchStatus,
  };
};

export default connect(mapStateToProps, {
  onOpenDownloads: openDownloads,
  onCloseDownloads: closeDownloads,
  fetchFiles: ({ ids = [] }) =>
    fetchFiles({
      url: `/api/v1/files?ids=${ids.join(',')}`,
      schema: filesListSchema,
    }),
})(withRequest(Downloads));
