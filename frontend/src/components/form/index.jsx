import * as React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonGroup } from '@atlaskit/button';
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
    const { isSending } = this.props;

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
            disabled={isSending}
            appearance="comment"
            contentTransformerProvider={schema =>
              new WikiMarkupTransformer(schema)
            }
            onSave={this.onSav}
            onCancel={this.onCancel}
          />
        </CollapsedEditor>
      </div>
    );
  }
}

Form.propTypes = {
  actions: PropTypes.shape({
    clear: PropTypes.func,
    getValue: PropTypes.func,
  }).isRequired,
  isSending: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
};

Form.defaultProps = {
  isSending: false,
};

export default props => (
  <EditorContext>
    <WithEditorActions
      render={actions => <Form {...props} actions={actions} />}
    />
  </EditorContext>
);
