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
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
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
          placeholder="What would you like to say?"
          isExpanded={isExpanded}
          onFocus={this.toggleEditor}
        >
          <Editor
            shouldFocus
            appearance="comment"
            contentTransformerProvider={schema =>
              new WikiMarkupTransformer(schema)
            }
            onSave={this.onSave}
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
