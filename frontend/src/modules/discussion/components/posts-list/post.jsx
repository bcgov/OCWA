import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import cx from 'classnames';
import Comment, { CommentTime } from '@atlaskit/comment';
import get from 'lodash/get';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { akColorN40 } from '@atlaskit/util-shared-styles';
import format from 'date-fns/format';

import * as styles from './styles.css';

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
        className={cx('discussion-post', styles.post)}
        style={{
          borderColor: `1px solid ${akColorN40}`,
        }}
      >
        <Comment
          avatar={<Avatar size="medium" />}
          isSaving={data.isSaving}
          author={get(data, 'authorUser', '')}
          content={this.renderContent()}
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
