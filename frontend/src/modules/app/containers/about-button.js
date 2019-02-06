import { connect } from 'react-redux';

import { toggleAbout } from '../actions';

// NOTE: This container just returns the connect function, add it to a button element
// where ever it is needed i.e. `const Button = aboutButton(CustomButtonElement)`
export default connect(null, {
  onClick: toggleAbout,
});
