import * as React from 'react';
import PropTypes from 'prop-types';
import Form from '@src/components/form';

function NewPost({ sendAction }) {
  return <Form onSave={value => sendAction('onSave', value)} />;
}

NewPost.propTypes = {
  sendAction: PropTypes.func.isRequired,
};

export default NewPost;
