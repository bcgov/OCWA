import { connect } from 'react-redux';
import findKey from 'lodash/findKey';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import Form from '../components/request-form/form';
import { fetchForm } from '../actions';
import { formSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const formEntities = get(state, 'data.entities.forms', {});
  const formId = findKey(formEntities, f => f.path === props.id);
  const form = get(formEntities, formId, {});

  return {
    newRequestId: state.requests.newRequestId,
    form,
    formId,
  };
};

export default connect(
  mapStateToProps,
  {
    initialRequest: ({ id }) =>
      fetchForm({
        url: `/api/v2/requests/forms/${id}`,
        schema: formSchema,
      }),
  }
)(withRequest(Form));
