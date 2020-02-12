import { connect } from 'react-redux';

import { fetchRequests, clearSearch } from '../actions';
import Search from '../components/search';
import { requestsListSchema } from '../schemas';

const mapStateToProps = state => ({
  value: state.requests.viewState.search,
});

export default connect(
  mapStateToProps,
  {
    onClear: clearSearch,
    onSearch: name =>
      fetchRequests(
        { name },
        {
          url: `/api/v2/requests?name=${name}*`,
          schema: requestsListSchema,
          search: name,
        }
      ),
  }
)(Search);
