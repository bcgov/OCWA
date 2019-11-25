import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { helpURL } from '@src/services/config';
import { codeExportEnabled } from '@src/services/config';

import NewRequest from '../components/request-form';
import { createRequest, fetchForm, fetchRequest } from '../actions';
import { formSchema, requestSchema } from '../schemas';

const mapStateToProps = state => ({
  helpURL,
  codeExportEnabled,
  newRequestId: state.requests.newRequestId,
  fetchStatus: get(state, 'data.fetchStatus.postRequests.requests', 'idle'),
  form: get(state, 'data.entities.forms.5dd4773368542243f49c23f9', {}),
});

// ID: 5dd4773368542243f49c23f9
// Path: data-export
export default connect(
  mapStateToProps,
  {
    initialRequest: () =>
      fetchForm({
        url: '/api/v1/requests/forms/data-export',
        schema: formSchema,
      }),
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
