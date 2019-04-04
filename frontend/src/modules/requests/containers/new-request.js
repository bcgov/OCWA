import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NewRequest from '../components/new-request';
import { viewDraftRequest } from '../actions';

const mapStateToProps = (state, props) => ({
  disabled: props.location.pathname === '/new',
});

export default withRouter(
  connect(mapStateToProps, {
    onClick: viewDraftRequest,
  })(NewRequest)
);
