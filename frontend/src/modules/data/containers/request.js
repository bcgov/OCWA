import { connect } from 'react-redux';
import get from 'lodash/get';

import withDataRequest from '../components/data-request';
import { fetchData, saveData, createData, deleteData } from '../actions';

const mapStateToProps = (request, state, props) => {
  const requestConfig = request(props);

  return {
    fetchStatus: get(state, `data.fetchStatus.${requestConfig.query}`, 'idle'),
    data: get(state, `data.entities.${requestConfig.query}`),
    requestConfig,
  };
};

export default function(request, container) {
  return connect(mapStateToProps.bind(null, request), {
    create: createData,
    destroy: deleteData,
    fetch: fetchData,
    save: saveData,
  })(withDataRequest(container));
}
