import * as React from 'react';
import {
  CollapsedEditor,
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';

class Form extends React.Component {
  state = {
    isExpanded: false,
  };

  toggleEditor = () => {
    this.setState(state => ({
      isExpanded: !state.isExpanded,
    }));
  };

  onCancel = () => {
    const { actions } = this.props;
    this.toggleEditor();
  };

  onSave = async () => {
    const { actions, onSave } = this.props;
    const value = await actions.getValue();

    if (value) {
      actions.clear();
      onSave(value);
    }
  };

  render() {
    const { isExpanded } = this.state;
    return (
      <div style={{ marginTop: 20 }}>
        <CollapsedEditor
          placeholder="Write a comment"
          isExpanded={isExpanded}
          onFocus={this.toggleEditor}
        >
          <Editor
            allowCodeBlocks
            shouldFocus
            appearance="comment"
            contentTransformerProvider={schema =>
              new WikiMarkupTransformer(schema)
            }
            onSave={this.onSave}
            onCancel={this.onCancel}
          />
        </CollapsedEditor>
      </div>
    );
  }
}

export default props => (
  <EditorContext>
    <WithEditorActions
      render={actions => <Form {...props} actions={actions} />}
    />
  </EditorContext>
);
