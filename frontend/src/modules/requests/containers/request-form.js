import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { helpURL } from '@src/services/config';
import {
  codeExportEnabled,
  dataRequestForm,
  codeRequestForm,
} from '@src/services/config';
import { _e } from '@src/utils';

import NewRequest from '../components/request-form';
import { createRequest, fetchRequest } from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => {
  const options = [
    { label: _e('{Data}'), value: 'data', form: dataRequestForm },
    { label: _e('Code {Request}'), value: 'code', form: codeRequestForm },
  ];
  return {
    data: options.filter(d => {
      if (d.value === 'code') {
        return codeExportEnabled;
      }
      return true;
    }),
    helpURL,
    codeExportEnabled,
    newRequestId: state.requests.newRequestId,
    fetchStatus: get(state, 'data.fetchStatus.postRequests.requests', 'idle'),
  };
};

export default connect(
  mapStateToProps,
  {
    onFetch: id =>
      fetchRequest({
        url: `/api/v1/requests/${id}`,
        schema: requestSchema,
        id,
      }),
    onCreate: (payload, meta) =>
      createRequest(payload, meta, {
        url: '/api/v1/requests',
        schema: { result: requestSchema },
      }),
  }
)(withRequest(NewRequest));
