import * as React from 'react';
import PropTypes from 'prop-types';
import Comment, { CommentTime } from '@atlaskit/comment';
import get from 'lodash/get';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { akColorN40 } from '@atlaskit/util-shared-styles';
import format from 'date-fns/format';

const adfEncoder = new ADFEncoder(schema => new WikiMarkupTransformer(schema));

class Post extends React.Component {
  renderContent = () => {
    const { data } = this.props;
    const comment = get(data, 'comment', '');
    const document = adfEncoder.encode(comment);

    return <ReactRenderer document={document} />;
  };

  render() {
    const { data } = this.props;

    return (
      <div
        style={{
          border: `1px solid ${akColorN40}`,
          borderRadius: 4,
          marginBottom: 20,
          padding: 10,
        }}
      >
        <Comment
          author={get(data, 'authorUser', '')}
          content={this.renderContent()}
          type="researcher"
          time={
            <CommentTime>
              {format(get(data, 'createdTs', new Date()), 'MMM DD, YYYY h:mA')}
            </CommentTime>
          }
        />
      </div>
    );
  }
}

Post.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    authorUser: PropTypes.string.isRequired,
    createdTs: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
