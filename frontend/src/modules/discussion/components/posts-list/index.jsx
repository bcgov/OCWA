import * as React from 'react';
import PropTypes from 'prop-types';
import EmptyChatIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Spinner from '@atlaskit/spinner';
import { akColorN70 } from '@atlaskit/util-shared-styles';

import Post from './post';
import * as styles from './styles.css';

function PostsList({ data, fetchStatus }) {
  if (fetchStatus === 'loaded' && data.length <= 0) {
    return (
      <div className={styles.empty}>
        <EmptyChatIcon size="xlarge" primaryColor={akColorN70} />
        <h5>No posts yet</h5>
        <p>Be the first to add to the discussion regarding this review!</p>
      </div>
    );
  }

  if (fetchStatus === 'loading') {
    return <Spinner size="large" />;
  }

  return (
    <div id="discussion-posts-list" className={styles.list}>
      {data.map(d => <Post key={d._id} data={d} />)}
    </div>
  );
}

PostsList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      authorUser: PropTypes.string,
      createdTs: PropTypes.string,
      comment: PropTypes.string,
    })
  ).isRequired,
  fetchStatus: PropTypes.string.isRequired,
};

export default PostsList;
