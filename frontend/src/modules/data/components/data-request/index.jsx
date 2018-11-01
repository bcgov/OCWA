import * as React from 'react';

function withDataRequest(Component) {
  return class extends React.Component {
    componentDidMount() {
      const { fetch, fetchStatus, requestConfig } = this.props;

      if (requestConfig.get && fetchStatus !== 'loaded') {
        fetch(requestConfig);
      }
    }

    onCreate = payload => {
      const { create, requestConfig } = this.props;

      if (requestConfig.create) {
        create({
          ...requestConfig.create,
          payload,
        });
      }
    };

    render() {
      const { fetchStatus } = this.props;

      if (fetchStatus === 'loading') {
        return <div>LOADING</div>;
      }

      return (
        <Component
          {...this.props}
          isSaving={fetchStatus === 'saving'}
          isFetching={fetchStatus === 'loading'}
          isLoaded={fetchStatus === 'loaded'}
          isIdle={fetchStatus === 'idle'}
          isFailed={fetchStatus === 'failed'}
          onCreate={this.onCreate}
        />
      );
    }
  };
}

export default withDataRequest;
