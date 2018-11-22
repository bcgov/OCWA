import { connect } from 'react-redux';
import get from 'lodash/get';

import PostsList from '../components/posts-list';

const mapStateToProps = (state, props) => {
  const ids = get(state, `discussion.posts.${props.id}`, []);
  const data = ids.map(id => get(state, `data.entities.posts.${id}`, {}));

  return {
    fetchStatus: get(state, 'data.fetchStatus.dataTypes.posts', 'idle'),
    data,
  };
};

export default connect(mapStateToProps)(PostsList);
