import { connect } from 'react-redux';

import Messages from '../components/messages';

const mapStateToProps = state => ({
  data: state.data.messages,
});

export default connect(mapStateToProps)(Messages);
