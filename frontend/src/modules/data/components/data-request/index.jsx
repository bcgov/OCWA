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
      const { fetchStatus, requestConfig } = this.props;

      if (fetchStatus === 'loading' && requestConfig.showLoading) {
        return <div>LOADING</div>;
      }

      return (
        <Component
          {...this.props}
          isSaving={fetchStatus === 'saving'}
          isLoading={fetchStatus === 'loading'}
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
