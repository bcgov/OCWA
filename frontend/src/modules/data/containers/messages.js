import { connect } from 'react-redux';

import { dismissMessages } from '../actions';
import Messages from '../components/messages';

const mapStateToProps = state => ({
  data: state.data.messages,
});

export default connect(mapStateToProps, {
  onDismiss: dismissMessages,
})(Messages);
