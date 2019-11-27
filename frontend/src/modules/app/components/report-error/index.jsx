import * as React from 'react';
import Button from '@atlaskit/button';
import Form, { Field } from '@atlaskit/form';
import ModalDialog, {
  ModalFooter,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Textarea from '@atlaskit/textarea';

function ReportError({ open, onCancel, onSubmit }) {
  const Container = ({ children, className }) => (
    <Form onSubmit={data => onSubmit(data.error)}>
      {({ formProps }) => (
        <form {...formProps} className={className}>
          {children}
        </form>
      )}
    </Form>
  );
  const Footer = () => (
    <ModalFooter>
      <Button onClick={onCancel}>Cancel</Button>
      <Button appearance="primary" type="submit">
        Submit
      </Button>
    </ModalFooter>
  );

  return (
    <ModalTransition>
      {open && (
        <ModalDialog
          components={{ Container, Footer }}
          heading="Report an Error"
        >
          <Field
            isRequired
            label="Error Description"
            name="error"
            defaultValue=""
          >
            {({ fieldProps }) => (
              <Textarea
                {...fieldProps}
                placeholder="Enter any details that you think might be relevant"
              />
            )}
          </Field>
        </ModalDialog>
      )}
    </ModalTransition>
  );
}

export default ReportError;
