import { connect } from 'react-redux';
import withRequest from '@src/modules/data/components/data-request';

import { postsListSchema } from '../schemas';
import { fetchPosts } from '../actions';
import Discussion from '../components/discussion';

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  initialRequest: ({ id }) =>
    fetchPosts(
      null,
      {
        topicId: id,
      },
      {
        url: `/api/v1/forums/comment/${id}`,
        schema: postsListSchema,
      }
    ),
})(withRequest(Discussion));
