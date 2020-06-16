import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import { SpotlightTarget } from '@atlaskit/onboarding';
import { getZoneString, _e } from '@src/utils';

import Form from '../../containers/form-wrapper';
import * as styles from './styles.css';
import './form.scss';

function NewRequestForm({
  data,
  // codeExportEnabled,
  formFetchStatus,
  history,
  location,
  sendAction,
}) {
  const submission = location.state || null;
  // Check the form type of a possibly duplicated request first
  const submittedExportType = get(submission, 'data.formName');
  const defaultExportType =
    data.find(d => d.form === submittedExportType) || {};
  const [exportType, setExportType] = React.useState(defaultExportType);
  const onSubmit = formData =>
    sendAction(
      'onCreate',
      { ...formData, exportType: exportType.value },
      { history }
    );

  React.useEffect(() => {
    if (isEmpty(exportType) && data.length >= 1) {
      setExportType(data[0]);
    }
  }, [data]);

  return (
    <Page>
      <div id="request-form-container" className={styles.container}>
        <Grid>
          <GridColumn medium={12}>
            <div className={styles.exportTypeSelect}>
              <SpotlightTarget name="new-request-types">
                <SectionMessage
                  appearance="info"
                  title={_e('Select {Request} Type')}
                >
                  <Select
                    options={data}
                    isDisabled={formFetchStatus === 'loading'}
                    placeholder={_e('Choose an {Request} Type')}
                    id="request-form-exportTypeSelect"
                    value={exportType}
                    onChange={value => setExportType(value)}
                  />
                </SectionMessage>
              </SpotlightTarget>
            </div>
            {data.reduce(
              (p, d) =>
                d.form === exportType.form ? (
                  <Form
                    key={d.form}
                    id={d.form}
                    form={d.form}
                    fetchStatus={formFetchStatus}
                    submission={submission}
                    onSubmit={onSubmit}
                  />
                ) : (
                  p
                ),
              null
            )}
            {formFetchStatus === 'loaded' && (
              <React.Fragment>
                <SectionMessage appearance="info" title="Additional Help">
                  <p>
                    For guidance, please review the documentation in your
                    project folder.
                  </p>
                </SectionMessage>
                <br />
                <SectionMessage
                  appearance="warning"
                  title="Affirmation of Confidentiality"
                >
                  <p>
                    {getZoneString({
                      internal:
                        'By completing this form and submitting the output package for review, I affirm that the requested outputs have been aggregated such that they are anonymous and do not relate, or cannot be related, to an identifiable individual, business or organization and therefore are safe for release.',
                      external:
                        'By completing this form and submitting this information for import, I affirm that the import does not contain any data which could be used to identify an individual person or other Protected Data. I also affirm that there are no legal, contractual or policy restrictions which would limit the use of the information for the Approved Project.',
                    })}
                  </p>
                </SectionMessage>
              </React.Fragment>
            )}
          </GridColumn>
        </Grid>
      </div>
    </Page>
  );
}

NewRequestForm.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      form: PropTypes.string.isRequired,
    })
  ).isRequired,
  // codeExportEnabled: PropTypes.bool.isRequired,
  formFetchStatus: PropTypes.oneOf(['loading', 'loaded', 'idle', 'failed'])
    .isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default NewRequestForm;
