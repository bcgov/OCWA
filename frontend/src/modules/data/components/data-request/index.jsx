import * as React from 'react';
import at from 'lodash/at';
import { compose } from 'redux';
import { connect } from 'react-redux';
import compact from 'lodash/compact';
import get from 'lodash/get';

import ErrorComponent from '../error';

function withRequest(Component) {
  class WithRequest extends React.Component {
    state = {
      error: null,
    };

    componentDidMount() {
      const { id, ids, initialRequest } = this.props;

      if (initialRequest) {
        const params = this.getParams();
        initialRequest({ ...params, id, ids });
      }
    }

    componentDidCatch(error, info) {
      this.setState({
        error: {
          message: error.message,
          info: info.componentStack,
        },
      });
    }

    getParams = () => {
      const values = compact(at(this.props, ['match.params', 'params']));
      let params = {};

      values.forEach(d => {
        params = { ...params, ...d };
      });

      return params;
    };

    sendAction = (action, payload, options = {}) => {
      const { id, ids } = this.props;
      const proxyAction = get(this.props, action);

      if (proxyAction) {
        const params = this.getParams();
        proxyAction(payload, { id, ids, ...options, ...params });
      } else {
        console.error(
          `No proxy action is defined in the container for ${action}`
        );
      }
    };

    render() {
      const { fetchStatus } = this.props;
      const { error } = this.state;
      const hasError = Boolean(error);

      if (hasError) {
        return <ErrorComponent data={error} />;
      }

      return (
        <Component
          {...this.props}
          isCreating={fetchStatus === 'creating'}
          isSaving={fetchStatus === 'saving'}
          isLoading={fetchStatus === 'loading'}
          isRefreshing={fetchStatus === 'refreshing'}
          isLoaded={fetchStatus === 'loaded'}
          isIdle={fetchStatus === 'idle'}
          isFailed={fetchStatus === 'failed'}
          sendAction={this.sendAction}
        />
      );
    }
  }

  WithRequest.displayName = `WithRequest(${Component.displayName ||
    Component.name ||
    'Component'})`;
  return WithRequest;
}

// TODO: Add some data specific items that might be important
const mapStateToProps = () => ({});

const composedWithRequest = compose(
  connect(mapStateToProps, null),
  withRequest
);

export default composedWithRequest;
