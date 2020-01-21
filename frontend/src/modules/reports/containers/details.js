import { connect } from 'react-redux';
import findKey from 'lodash/findKey';
import get from 'lodash/get';
import { fetchForm } from '@src/modules/requests/actions';
import { formSchema } from '@src/modules/requests/schemas';
import withRequest from '@src/modules/data/components/data-request';

import Details from '../components/request/details';

const mapStateToProps = (state, props) => {
  const formName = get(props, 'data.formName');
  const formEntities = get(state, 'data.entities.forms', {});
  const formId = findKey(formEntities, f => f.path === formName);
  const form = get(formEntities, formId, {});
  const allFields = get(form, 'components', []);
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
    form: {
      ...form,
      components: fields.filter(f => f.key !== 'name'),
    },
    fields,
  };
};

export default connect(mapStateToProps, {
  fetchForm: ({ id }) =>
    fetchForm({
      url: `/api/v2/requests/forms/${id}`,
      schema: formSchema,
    }),
})(withRequest(Details));
