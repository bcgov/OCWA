import { connect } from 'react-redux';
import get from 'lodash/get';
import withRequest from '@src/modules/data/components/data-request';

import { createPost } from '../actions';
import NewPost from '../components/new-post';
import { postSchema } from '../schemas';

const mapStateToProps = state => ({
  isSending: get(state, 'data.fetchStatus.postRequests.posts') === 'creating',
});

export default connect(mapStateToProps, {
  onSave: (payload, { id }) =>
    createPost(
      { comment: payload },
      { topicId: id, comment: payload },
      {
        url: `/api/v1/forums/comment/${id}`,
        schema: { result: postSchema },
      }
    ),
})(withRequest(NewPost));
