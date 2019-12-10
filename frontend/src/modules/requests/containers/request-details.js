import { connect } from 'react-redux';
import findKey from 'lodash/findKey';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import Details from '../components/request/details';
import { fetchForm } from '../actions';
import { formSchema } from '../schemas';

const mapStateToProps = (state, props) => {
  const formName = get(props, 'data.formName');
  const formEntities = get(state, 'data.entities.forms', {});
  const formId = findKey(formEntities, f => f.path === formName);
  const allFields = get(formEntities, [formId, 'components'], []);
  const fields = [];

  const fieldCrawler = d => {
    if (d.input && d.tableView) {
      fields.push(d);
    }

    if (d.components) {
      d.components.forEach(fieldCrawler);
    }
  };

  allFields.forEach(fieldCrawler);

  return {
    fields,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchForm: ({ id }) =>
      fetchForm({
        url: `/api/v1/requests/forms/${id}`,
        schema: formSchema,
      }),
  }
)(withRequest(Details));
