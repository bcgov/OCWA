/**
   This is a helper function to help you create data layer actions. To use:

   In your actions file create methods that define the action type. Naming convention
   must follow: `resource_type/(get|put|post|delete)`. We're basically declaring
   the actions we want to track in the data layer.

   `actions-file.js`
   ```
   import { createDataAction } from '@src/modules/data/actions'
   export const fetchData = createDataAction('type/get');
   ```

   In a container file you can pass specific parameters for that data action. This
   extra step is because we might want to request a model, but the URL or parameters
   might change on a per container basis, but the request method won't change. You
   can pass these as in the `mapDispatchToProps` argument of `connect`. The `withRequest`
   HOC will pass arguments to this method.

   The convention to pass arguments to the curried function is `payload, meta, request`.
   If you want to pass meta, but not a payload, the first argument should be null

   `container.js`
   ```
   import { action } from '../actions'

   export default connect(mapStateToProps, {
    fetchData: (payload, meta) => ({
      url: '/api/v1/requests'
    })
   })(withRequest(Component))
   ```
*/
import last from 'lodash/last';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';

export const createDataAction = type => (...args) => {
  const requestConfig = last(args);
  const requestKeys = keys(requestConfig);
  const meta = args.length === 1 ? args[0] : args[1];
  const payload = args.length > 1 ? args[0] : {};
  const action = {
    type,
    meta: {
      ...meta,
      ...requestConfig,
    },
    payload,
  };

  if (!requestKeys.includes('url')) {
    throw new Error('A `url` parameter is required in the request config');
  }

  return omitBy(action, isEmpty);
};

export const dismissMessages = id => ({
  type: 'messages/dismiss',
  payload: id,
});

export default {
  createDataAction,
  dismissMessages,
};
