import * as React from 'react';

function withDataRequest(Component) {
  return class extends React.Component {
    componentDidMount() {
      const { fetch, fetchStatus, requestConfig } = this.props;

      if (fetch && fetchStatus !== 'loaded') {
        fetch(requestConfig);
      }
    }

    render() {
      const { fetchStatus } = this.props;

      if (fetchStatus === 'loading') {
        return <div>LOADING</div>;
      }

      return <Component {...this.props} />;
    }
  };
}

export default withDataRequest;
