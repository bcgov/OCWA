import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

function withRequestTest(Component, options) {
  return class extends React.Component {
    componentDidMount() {
      const { dispatch, match } = this.props;
      if (options.initialRequest) {
        dispatch(options.initialRequest(match.params));
      }
    }

    onCreate = payload => {
      const { dispatch, match } = this.props;

      if (options.create) {
        dispatch(options.create(payload, match.params));
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
          isSaving={fetchStatus === 'saving'}
          isLoading={fetchStatus === 'loading'}
          isLoaded={fetchStatus === 'loaded'}
          isIdle={fetchStatus === 'idle'}
          isFailed={fetchStatus === 'failed'}
          onCreate={this.onCreate}
          onSave={this.onSave}
        />
      );
    }
  };
}

const mapStateToProps = (state, props) => {
  return {};
};

const composedWithRequestTest = compose(
  connect(mapStateToProps, null),
  withRequestTest
);

export default composedWithRequestTest;
