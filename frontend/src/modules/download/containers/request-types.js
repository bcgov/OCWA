import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import { fetchRequestTypes } from '../actions';
import RequestTypes from '../components/request-types';

const mapStateToProps = state => ({
  data: state.download.requestTypes,
  fetchStatus: get(state, 'data.fetchStatus.dataTypes.requestTypes', 'idle'),
});

export default connect(mapStateToProps, {
  initialRequest: () =>
    fetchRequestTypes(
      {},
      { dataType: 'requestTypes' },
      {
        url: '/api/v1/requests/request_types',
      }
    ),
})(withRequest(RequestTypes));
