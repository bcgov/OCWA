import { connect } from 'react-redux';
import get from 'lodash/get';
import last from 'lodash/last';
import withRequest from '@src/modules/data/components/data-request';
import { zone } from '@src/services/config';

import { fetchRequest, finishEditing, reset, saveRequest } from '../actions';
import Request from '../components/request';
import { requestSchema } from '../schemas';

const defaultRequest = {
  chronology: [],
  files: [],
  fileStatus: {},
  reviewers: [],
  supportingFiles: [],
};

const mapStateToProps = (state, props) => {
  const { requestId } = props.match.params;
  const data = get(
    state,
    `data.entities.requests.${requestId}`,
    defaultRequest
  );
  const updatedAt = get(
    last(data.chronology),
    'timestamp',
    new Date().toString()
  );

  return {
    data,
    duplicateFiles: get(state, 'requests.viewState.filesToDuplicate'),
    isOutputChecker: state.app.auth.user.groups.includes('/oc'),
    updatedAt,
    fetchStatus: get(
      state,
      `data.fetchStatus.entities.requests.${requestId}`,
      'idle'
    ),
    isSubmitting: state.requests.viewState.isSubmitting,
    zone,
  };
};

export default connect(
  mapStateToProps,
  {
    initialRequest: ({ requestId }) =>
      fetchRequest({
        url: `/api/v2/requests/${requestId}`,
        schema: requestSchema,
        id: requestId,
      }),
    onReset: reset,
    onFinishEditing: finishEditing,
    onSave: (payload, meta) =>
      saveRequest(payload, meta, {
        url: `/api/v2/requests/save/${meta.id}`,
        schema: { result: requestSchema },
      }),
  }
)(withRequest(Request));
