import React from 'react';
import Comment, { CommentTime } from '@atlaskit/comment';
import { Date } from '@atlaskit/date';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { akColorN40 } from '@atlaskit/util-shared-styles';

const adfEncoder = new ADFEncoder(schema => new WikiMarkupTransformer(schema));

export default class extends React.Component {
  renderContent = () => {
    const { data } = this.props;
    const document = adfEncoder.encode(data.value);

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
          author="Joshua R Jones"
          content={this.renderContent()}
          type="reviewer"
          time={
            <CommentTime>
              <Date
                color="white"
                value={data.createdAt}
                format="MMM DD, YYYY h:mA"
              />
            </CommentTime>
          }
        />
      </div>
    );
  }
}
