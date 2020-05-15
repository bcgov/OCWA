import { connect } from 'react-redux';

import HelpDialog from '../components/help-dialog';
import { toggleHelp } from '../actions';

const mapStateToProps = state => ({
  open: state.help.open,
});

export default connect(mapStateToProps, {
  onClose: toggleHelp,
})(HelpDialog);
