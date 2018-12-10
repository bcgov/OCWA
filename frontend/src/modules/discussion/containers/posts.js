import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';

import PostsList from '../components/posts-list';

const mapStateToProps = (state, props) => {
  const ids = get(state, `discussion.posts.${props.id}`, []);
  const data = ids.map(id => {
    if (has(state, `discussion.newPosts.${id}`)) {
      return get(state, `discussion.newPosts.${id}`);
    }

    return get(state, `data.entities.posts.${id}`, {});
  });

  return {
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.posts', 'idle'),
    data,
  };
};

export default connect(mapStateToProps)(PostsList);
