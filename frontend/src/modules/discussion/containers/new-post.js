import { connect } from 'react-redux';
import withRequest from '@src/modules/data/components/data-request';

import { createPost } from '../actions';
import NewPost from '../components/new-post';
import { postSchema } from '../schemas';

export default connect(null, {
  onSave: (payload, { id }) =>
    createPost(
      { comment: payload },
      {
        url: `/api/v1/forums/comment/${id}`,
        schema: postSchema,
      }
    ),
})(withRequest(NewPost));
