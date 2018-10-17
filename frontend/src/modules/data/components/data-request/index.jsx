import * as React from 'react';

function withDataRequest(Component) {
  return class extends React.Component {
    componentDidMount() {
      const { fetch, requestConfig } = this.props;

      if (fetch) {
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
