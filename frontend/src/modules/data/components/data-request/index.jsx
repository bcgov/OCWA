import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

function withRequest(Component, options) {
  class WithRequest extends React.Component {
    componentDidMount() {
      const { dispatch, match } = this.props;
      if (options.initialRequest) {
        dispatch(options.initialRequest(match.params));
      }
    }

    onCreate = payload => {
      const { dispatch } = this.props;

      if (options.create) {
        dispatch(options.create(payload));
      }
    };

    onSave = payload => {
      const { dispatch, id, match } = this.props;
      if (options.save) {
        const variables = match ? match.params : { id };
        dispatch(options.save(payload, variables));
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
          onCreate={this.onCreate}
          onSave={this.onSave}
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
