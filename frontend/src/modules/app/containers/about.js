import { connect } from 'react-redux';

import About from '../components/app/about';
import { toggleAbout } from '../actions';

const mapStateToProps = state => ({
  data: [],
  open: state.app.viewState.isAboutOpen,
});

export default connect(mapStateToProps, {
  onToggle: toggleAbout,
})(About);
