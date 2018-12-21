import * as React from 'react';
import PropTypes from 'prop-types';
import NewPost from '../../containers/new-post';

import PostsList from '../../containers/posts';
import * as styles from './styles.css';

function Discussion({ id }) {
  return (
    <div id="discussion" className={styles.container}>
      <PostsList id={id} />
      <NewPost id={id} />
    </div>
  );
}

Discussion.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Discussion;
