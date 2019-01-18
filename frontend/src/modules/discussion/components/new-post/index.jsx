import * as React from 'react';
import PropTypes from 'prop-types';
import Form from '@src/components/form';

function NewPost({ sendAction, isSending }) {
  return (
    <div id="discussion-form">
      <Form
        isSending={isSending}
        onSave={value => sendAction('onSave', value)}
      />
    </div>
  );
}

NewPost.propTypes = {
  isSending: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default NewPost;
