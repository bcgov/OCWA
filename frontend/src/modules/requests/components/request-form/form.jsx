import * as React from 'react';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Form, { Field, FormSection } from '@atlaskit/form';
import isEqual from 'lodash/isEqual';

import { RequestSchema } from '../../types';

class NewRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    const { data } = this.props;

    return !isEqual(data, nextProps.data);
  }

  validate = () => {
    const validation = this.formRef.current.validate();
    return validation;
  };

  render() {
    const { data } = this.props;

    return (
      <div id="request-form">
        <Form ref={this.formRef}>
          <Field isRequired label="Request Name" id="name">
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
            <Field
              id="purpose"
              label="Purpose"
              helperText="Purpose of the request"
            >
              <FieldTextArea
                shouldFitContainer
                name="purpose"
                id="purpose"
                value={data.purpose}
              />
            </Field>
            <Field
              id="variableDescriptions"
              label="Variable Descriptions"
              helperText="Description of variables in the request"
            >
              <FieldTextArea
                shouldFitContainer
                name="variableDescriptions"
                id="variableDescriptions"
                value={data.variableDescriptions}
              />
            </Field>
            <Field
              id="selectionCriteria"
              label="Selection Criteria"
              helperText="Selection criteria and sample size description for the request"
            >
              <FieldTextArea
                shouldFitContainer
                name="selectionCriteria"
                id="selectionCriteria"
                value={data.selectionCriteria}
              />
            </Field>
            <Field
              id="steps"
              label="Steps"
              helperText="Annotation of steps taken"
            >
              <FieldTextArea
                shouldFitContainer
                name="steps"
                id="steps"
                value={data.steps}
              />
            </Field>
            <Field
              id="freq"
              label="Frequency"
              helperText="Weighted results and unweighted frequencies"
            >
              <FieldTextArea
                shouldFitContainer
                id="freq"
                name="freq"
                value={data.freq}
              />
            </Field>
            <Field
              id="confidentiality"
              label="Confidentiality"
              helperText="Confidentiality disclosure to describe how it's upheld when criteria isn't met"
            >
              <FieldTextArea
                shouldFitContainer
                id="confidentiality"
                name="confidentiality"
                value={data.confidentiality}
              />
            </Field>
          </FormSection>
        </Form>
      </div>
    );
  }
}

NewRequestForm.propTypes = {
  data: RequestSchema.isRequired,
};

export default React.forwardRef((props, ref) => (
  <NewRequestForm {...props} ref={ref} />
));
