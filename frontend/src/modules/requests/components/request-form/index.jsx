import * as React from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import { _e } from '@src/utils';
import { Form } from 'react-formio';
// import Form from './form';
import * as styles from './styles.css';

// NOTE: This container has to physically switch the forms, due to the black
// box nature of the `Form` component it cache's the onSubmit callback and will
// not change if the `exportType` variable changes
function NewRequestForm({
  codeExportEnabled,
  form,
  helpURL,
  history,
  isCreating,
  location,
  sendAction,
}) {
  const data = location.state || {};
  const exportTypeOptions = [
    { label: _e('{Data}'), value: 'data' },
    { label: _e('Code {Request}'), value: 'code' },
  ];
  const defaultState = data.exportType
    ? exportTypeOptions.find(d => d.value === data.exportType)
    : exportTypeOptions[0];
  const [exportType, setExportType] = React.useState(defaultState);
  const onSubmit = (formData, files) =>
    sendAction(
      'onCreate',
      { ...formData, exportType: exportType.value },
      { history, files }
    );
  const formProps = {
    data,
    isCreating,
    helpURL,
    exportType: exportType.value,
    onSubmit,
  };

  return (
    <Page>
      <div id="request-form-container" className={styles.container}>
        <Grid>
          <GridColumn medium={12}>
            <Form form={form} />
          </GridColumn>
        </Grid>
      </div>
    </Page>
  );

  /* return (
   *   <Page>
   *     <div id="request-form-container" className={styles.container}>
   *       <Grid>
   *         <GridColumn medium={12}>
   *           <h2>{`Initiate a New ${exportType.label} Request`}</h2>
   *           <p>
   *             Please ensure that you also have the following elements, as
   *             appropriate, with your output submission: descriptive labeling
   *             (ideally alongside each component), information for specific
   *             output types, and, log files or annotated steps of analysis.
   *           </p>
   *           {codeExportEnabled && (
   *             <div className={styles.exportTypeSelect}>
   *               <SectionMessage
   *                 appearance="info"
   *                 title={_e('Select {Request} Type')}
   *               >
   *                 <Select
   *                   options={exportTypeOptions}
   *                   placeholder={_e('Choose an {Request} Type')}
   *                   id="request-form-exportTypeSelect"
   *                   defaultValue={exportType}
   *                   onChange={value => setExportType(value)}
   *                 />
   *               </SectionMessage>
   *             </div>
   *           )}
   *           {exportType.value === 'data' && <Form {...formProps} />}
   *           {exportType.value === 'code' && codeExportEnabled && (
   *             <Form {...formProps} />
   *           )}
   *         </GridColumn>
   *       </Grid>
   *     </div>
   *   </Page>
   * ); */
}

NewRequestForm.propTypes = {
  codeExportEnabled: PropTypes.bool.isRequired,
  helpURL: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  isCreating: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  sendAction: PropTypes.func.isRequired,
};

NewRequestForm.defaultProps = {
  helpURL: null,
};

export default NewRequestForm;
