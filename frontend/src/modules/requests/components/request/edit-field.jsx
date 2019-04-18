import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import InlineEdit from '@atlaskit/inline-edit';
import isEmpty from 'lodash/isEmpty';
import Field from '../request-form/field';

import { phoneNumberRegex } from '../../utils';

const phoneNumberValidation = new RegExp(phoneNumberRegex, 'g');

class EditField extends React.PureComponent {
  state = {
    value: get(this, 'props.data.value', ''),
    isInvalid: false,
  };

  onChange = event => {
    const { value } = event.target;
    const isInvalid = this.validator(value);

    this.setState({
      value,
      isInvalid,
    });
  };

  onCancel = () => {
    const { data } = this.props;

    this.setState({
      value: data.value,
    });
  };

  onSubmit = () => {
    const { data, onSave } = this.props;
    const { isInvalid, value } = this.state;

    if (!isInvalid) {
      onSave({ [data.key]: value });
    }
  };

  validator = value => {
    const { data } = this.props;
    let isInvalid = data.isRequired ? isEmpty(value.trim()) : false;

    if (data.type === 'tel' && !isInvalid) {
      isInvalid = !phoneNumberValidation.test(value);
    }

    return isInvalid;
  };

  render() {
    const { isEditing, data } = this.props;
    const { isInvalid, value } = this.state;
    const readViewElement = (
      <p id={`request-${data.key}-text`}>
        {value || 'Nothing added. Click to edit'}
      </p>
    );

    return (
      <div id={`request-${data.key}-field`}>
        <InlineEdit
          areActionButtonsHidden={isInvalid && data.isRequired}
          isConfirmOnBlurDisabled
          isFitContainerWidthReadView
          isInvalid={isInvalid}
          label={data.name}
          editView={
            isEditing && (
              <Field
                type={data.type}
                fieldProps={{
                  autoFocus: true,
                  appearance: 'none',
                  id: `request-${data.key}-input`,
                  onChange: this.onChange,
                  value: value || '',
                }}
              />
            )
          }
          readView={readViewElement}
          onCancel={this.onCancel}
          onConfirm={this.onSubmit}
        />
      </div>
    );
  }
}

EditField.propTypes = {
  data: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'textarea', 'tel', 'email']).isRequired,
    isRequired: PropTypes.bool,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditField;
