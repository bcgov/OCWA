import * as React from 'react';
import PropTypes from 'prop-types';
import Form from '@src/components/form';

function NewPost({ sendAction }) {
  return (
    <div id="discussion-form">
      <Form onSave={value => sendAction('onSave', value)} />
    </div>
  );
}

NewPost.propTypes = {
  sendAction: PropTypes.func.isRequired,
};

export default NewPost;
