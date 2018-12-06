import * as React from 'react';
import PropTypes from 'prop-types';
import NewPost from '../../containers/new-post';

import PostsList from '../../containers/posts';

function Discussion({ id }) {
  return (
    <div id="discussion">
      <PostsList id={id} />
      <NewPost id={id} />
    </div>
  );
}

Discussion.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Discussion;
