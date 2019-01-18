import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import NewRequest from '../components/new-request';
import { viewDraftRequest } from '../actions';

const mapStateToProps = state => ({
  disabled: !isEmpty(state.requests.viewState.currentRequestId),
});

export default connect(mapStateToProps, {
  onClick: viewDraftRequest,
})(NewRequest);
