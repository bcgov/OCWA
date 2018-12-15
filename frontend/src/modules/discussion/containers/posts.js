import { connect } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import PostsList from '../components/posts-list';

const mapStateToProps = (state, props) => {
  const ids = get(state, `discussion.posts.${props.id}`, []);
  const data = ids.map(id => get(state, `data.entities.posts.${id}`, {}));
  const fetchStatus = get(state, 'data.fetchStatus.dataTypes.posts', 'idle');

  if (!isEmpty(state.discussion.newPost)) {
    data.push(state.discussion.newPost);
  }

  return {
    data,
    fetchStatus:
      fetchStatus === 'loading' && data.length > 0 ? 'loaded' : fetchStatus,
  };
};

export default connect(mapStateToProps)(PostsList);
