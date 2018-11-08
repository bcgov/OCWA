import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';

function withRequest(Component) {
  class WithRequest extends React.Component {
    componentDidMount() {
      const { match, initialRequest } = this.props;

      if (initialRequest) {
        initialRequest(match.params);
      }
    }

    sendAction = (action, payload, options = {}) => {
      const { id, match } = this.props;
      const proxyAction = get(this.props, action);

      if (proxyAction) {
        const params = get(match, 'params', {});
        proxyAction(payload, { id, ...options, ...params });
      } else {
        console.error(
          `No proxy action is defined in the container for ${action}`
        );
      }
    };

    render() {
      const { fetchStatus } = this.props;

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
