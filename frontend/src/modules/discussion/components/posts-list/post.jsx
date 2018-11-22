import * as React from 'react';
import PropTypes from 'prop-types';
import Comment, { CommentTime } from '@atlaskit/comment';
import { Date } from '@atlaskit/date';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { akColorN40 } from '@atlaskit/util-shared-styles';

const adfEncoder = new ADFEncoder(schema => new WikiMarkupTransformer(schema));

class Post extends React.Component {
  renderContent = () => {
    const { data } = this.props;
    const document = adfEncoder.encode(data.comment);

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
          author={data.author_user}
          content={this.renderContent()}
          type="reviewer"
          time={
            <CommentTime>
              <Date
                color="white"
                value={data.created_ts}
                format="MMM DD, YYYY h:mA"
              />
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
    author_user: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
