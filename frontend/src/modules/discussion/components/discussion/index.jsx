import * as React from 'react';
import PropTypes from 'prop-types';
import NewPost from '../../containers/new-post';
import Title from '@src/components/title';

import PostsList from '../../containers/posts';
import * as styles from './styles.css';

function Discussion({ id, title }) {
  return (
    <div id="discussion" className={styles.container}>
      <Title>{`${title} | Discussion `}</Title>
      <PostsList id={id} />
      <NewPost id={id} />
    </div>
  );
}

Discussion.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Discussion;
