import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';
import { codeExportEnabled, helpURL, zone } from '@src/services/config';
import merge from 'lodash/merge';
import { _e } from '@src/utils';

import NewRequest from '../components/request-form';
import { createRequest, fetchForms, fetchRequest } from '../actions';
import { requestSchema } from '../schemas';

const mapStateToProps = state => {
  const forms = get(state, `data.entities.forms.${zone}`, []);
  const optionsTemplate = [
    { label: _e('{Data}'), value: 'data' },
    { label: _e('Code {Request}'), value: 'code' },
  ];
  const options = merge([], forms, optionsTemplate);

  return {
    data: options.filter(d => {
      if (!d.form) return false;

      if (d.value === 'code') {
        return codeExportEnabled;
      }
      return true;
    }),
    helpURL,
    codeExportEnabled,
    newRequestId: state.requests.newRequestId,
    fetchStatus: get(state, 'data.fetchStatus.postRequests.requests', 'idle'),
    formFetchStatus: get(state, 'data.fetchStatus.dataTypes.forms', 'idle'),
  };
};

export default connect(mapStateToProps, {
  initialRequest: () =>
    fetchForms({
      url: '/api/v2/requests/forms/defaults',
    }),
  onFetch: id =>
    fetchRequest({
      url: `/api/v2/requests/${id}`,
      schema: requestSchema,
      id,
    }),
  onCreate: (payload, meta) =>
    createRequest(payload, meta, {
      url: '/api/v2/requests',
      schema: { result: requestSchema },
    }),
})(withRequest(NewRequest));
