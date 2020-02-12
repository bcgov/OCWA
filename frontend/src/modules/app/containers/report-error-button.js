import { connect } from 'react-redux';

import { toggleReportError } from '../actions';

// NOTE: This container just returns the connect function, add it to a button element
// where ever it is needed i.e. `const Button = reportErrorButton(CustomButtonElement)`
export default connect(
  null,
  {
    onClick: toggleReportError,
  }
);
