import { connect } from 'react-redux';
import ReportError from '../components/report-error';

import { reportError, toggleReportError } from '../actions';

const mapStateToProps = state => ({
  open: state.app.viewState.isReportErrorOpen,
});

export default connect(
  mapStateToProps,
  {
    onCancel: toggleReportError,
    onSubmit: reportError,
  }
)(ReportError);
