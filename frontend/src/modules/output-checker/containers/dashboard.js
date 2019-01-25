import { connect } from 'react-redux';

import { changeFilter, search } from '../actions';
import Dashboard from '../components/dashboard';

const mapStateToProps = state => ({
  filter: state.outputChecker.viewState.filter,
  search: state.outputChecker.viewState.search,
});

export default connect(mapStateToProps, {
  onFilterChange: changeFilter,
  onSearchChange: search,
})(Dashboard);
