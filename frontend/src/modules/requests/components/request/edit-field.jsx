import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';

class EditField extends React.Component {
  state = {
    value: get(this, 'props.data.value', ''),
  };

  onChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  onCancel = () => {
    this.setState({
      value: '',
    });
  };

  onSubmit = () => {
    const { data, onSave } = this.props;
    const { value } = this.state;

    if (value.trim()) {
      onSave({ [data.key]: value });
    }
  };

  render() {
    const { isEditing, data } = this.props;
    const { value } = this.state;

    return (
      <InlineEdit
        isFitContainerWidthReadView
        isConfirmOnBlurDisabled
        label={data.name}
        editView={
          isEditing && (
            <SingleLineTextInput
              isEditing
              isInitiallySelected
              id={`request-${data.key}-input`}
              onChange={this.onChange}
              value={value}
            />
          )
        }
        readView={
          <p id={`request-${data.key}-text`}>
            {value || 'Nothing added. Click to edit'}
          </p>
        }
        onCancel={this.onCancel}
        onConfirm={this.onSubmit}
      />
    );
  }
}

EditField.propTypes = {
  data: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditField;
