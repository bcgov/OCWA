import * as React from 'react';
//import PropTypes from 'prop-types';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Form, { Field, FormSection } from '@atlaskit/form';

import { RequestSchema } from '../../types';

class NewRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  validate = () => {
    const validation = this.formRef.current.validate();
    return validation;
  };

  render() {
    const { data } = this.props;

    return (
      <Form ref={this.formRef}>
        <Field validateOnChange isRequired label="Request Name" id="name">
          <FieldText
            shouldFitContainer
            name="name"
            id="name"
            value={data.name || ''}
          />
        </Field>
        <FormSection
          name="additional"
          title="Additional Information"
          description="These fields aren't required but are recommended"
        >
          <Field label="Purpose" helperText="Purpose of the request">
            <FieldTextArea
              shouldFitContainer
              name="purpose"
              value={data.purpose}
            />
          </Field>
          <Field
            label="Variable Descriptions"
            helperText="Description of variables in the request"
          >
            <FieldTextArea
              shouldFitContainer
              name="variableDescriptions"
              value={data.variableDescriptions}
            />
          </Field>
          <Field
            label="Selection Criteria"
            helperText="Selection criteria and sample size description for the request"
          >
            <FieldTextArea
              shouldFitContainer
              name="selectionCriteria"
              value={data.selectionCriteria}
            />
          </Field>
          <Field label="Steps" helperText="Annotation of steps taken">
            <FieldTextArea shouldFitContainer name="steps" value={data.steps} />
          </Field>
          <Field
            label="Frequency"
            helperText="Weighted results and unweighted frequencies"
          >
            <FieldTextArea shouldFitContainer name="freq" value={data.freq} />
          </Field>
          <Field
            label="Confidentiality"
            helperText="Confidentiality disclosure to describe how it's upheld when criteria isn't met"
          >
            <FieldTextArea
              shouldFitContainer
              name="confidentiality"
              value={data.confidentiality}
            />
          </Field>
        </FormSection>
      </Form>
    );
  }
}

NewRequestForm.propTypes = {
  data: RequestSchema.isRequired,
};

export default React.forwardRef((props, ref) => (
  <NewRequestForm {...props} ref={ref} />
));
