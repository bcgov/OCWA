import * as React from 'react';
import cx from 'classnames';
import DateTime from '@src/components/date';
import ExportTypeIcon from '@src/components/export-type-icon';
import Files from '@src/modules/files/containers/files';
import { Link } from 'react-router-dom';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import RequestIcon from '@src/modules/requests/components/request-icon';
import StateLabel from '@src/modules/requests/components/state-label';
import { uid } from 'react-uid';
import { getRequestStateColor } from '@src/modules/requests/utils';
import RequestType from '@src/modules/requests/components/request/request-type';
import { RequestSchema } from '@src/modules/requests/types';
import { colors } from '@atlaskit/theme';

import * as styles from './styles.css';

const getChronologyText = state => {
  switch (state) {
    case 0:
      return 'Request created';
    case 1:
      return 'Request updated';
    case 2:
      return 'Request submitted';
    case 3:
      return 'Request claimed';
    case 4:
      return 'Request approved';
    case 5:
      return 'Errors in request stopped and reported';
    case 6:
      return 'Request cancelled';
    default:
      return 'Unknown';
  }
};
const getBorderColor = state =>
  state > 3 ? getRequestStateColor(state) : null;

const DATE_FORMAT = 'MMMM Do YYYY [at] h:mm:ss aa';

function Request({ data }) {
  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <header className={styles.header}>
            <small>
              <Link to="/">&laquo; Back to Dashboard</Link>
            </small>
            <h2 className={styles.title}>
              <span className={styles.titleText}>
                <ExportTypeIcon large exportType={data.exportType} />
                {data.name}
              </span>
              <StateLabel id={data._id} value={data.state} />
            </h2>
            <p id="request-header-details" className={styles.headerDetailsText}>
              <RequestType type={data.type} />
              <span>by</span>
              <strong>{data.author}</strong>
            </p>
          </header>
        </GridColumn>
      </Grid>
      <Grid>
        <GridColumn medium={12}>
          <div className={styles.summaryTable}>
            <div className={styles.summaryCell}>
              <div className={styles.summaryCellValueText}>
                <DateTime
                  value={data.firstSubmittedDate}
                  format="MMM Do YYYY"
                />
              </div>
              <h6>First Submission Date</h6>
            </div>
            <div className={styles.summaryCell}>
              <div className={styles.summaryCellValueText}>
                {data.approvedDate ? (
                  <DateTime value={data.approvedDate} format="MMM Do YYYY" />
                ) : (
                  'N/A'
                )}
              </div>
              <h6>Approval Date</h6>
            </div>
            <div className={styles.summaryCell}>
              <div className={styles.summaryCellValueText}>
                {data.daysUntilApproval}
              </div>
              <h6>Days To Approval</h6>
            </div>
            <div className={styles.summaryCell}>
              <div className={styles.summaryCellValueText}>
                {data.submissionsCount}
              </div>
              <h6>Submissions Total</h6>
            </div>
          </div>
          <header className={styles.chronologyHeader}>
            <h4>Request Details</h4>
          </header>
          {data.exportType === 'code' && (
            <div className={styles.details}>
              <dl>
                <dt>External Repository</dt>
                <dd id="request-details-external-repo-text">
                  {data.externalRepository}
                </dd>
                <dt>Branch Name</dt>
                <dd id="request-details-branch-text">{data.branch}</dd>
                <dt>Repository</dt>
                <dd id="request-details-repository-text">{data.repository}</dd>
              </dl>
            </div>
          )}
          {data.exportType !== 'code' && (
            <div className={styles.details}>
              <dl>
                <dt>Variable Descriptions</dt>
                <dd id="request-details-variable-text">
                  {data.variableDescriptions}
                </dd>
                <dt>Relationship to previous or future (planned) outputs</dt>
                <dd id="request-details-selection-text">
                  {data.selectionCriteria}
                </dd>
              </dl>
            </div>
          )}
          {data.exportType !== 'code' && (
            <React.Fragment>
              <header className={styles.chronologyHeader}>
                <h4>Request Files</h4>
              </header>
              <div className={styles.details}>
                <Files
                  id={data._id}
                  ids={data.files}
                  fileStatus={data.fileStatus}
                />
              </div>
            </React.Fragment>
          )}
          <header className={styles.chronologyHeader}>
            <h4>Request Timeline</h4>
          </header>
          <ol className={styles.chronologyList}>
            {data.chronology.map(d => (
              <li
                key={uid(d)}
                className={cx(
                  styles.chronologyListItem,
                  `request-chronology-item-state-${d.enteredState}`
                )}
              >
                <div
                  className={styles.icon}
                  style={{
                    borderColor: getBorderColor(d.enteredState),
                  }}
                >
                  <RequestIcon value={d.enteredState} size="medium" />
                </div>
                <div
                  className={styles.content}
                  style={{
                    borderColor: getBorderColor(d.enteredState),
                  }}
                >
                  <header>
                    <h6>
                      <strong>
                        <DateTime value={d.timestamp} format={DATE_FORMAT} />
                      </strong>
                    </h6>
                  </header>
                  <div>
                    <div className={styles.body}>
                      {`${getChronologyText(d.enteredState)} by ${d.changeBy}`}
                    </div>
                    {d.changes &&
                      d.changes.files &&
                      d.changes.files.length > 0 && (
                        <div className={styles.files}>
                          <header>
                            <h6>Export Files</h6>
                          </header>
                          <Files
                            id={data._id}
                            ids={d.changes.files}
                            fileStatus={data.fileStatus}
                          />
                        </div>
                      )}
                    {d.changes &&
                      d.changes.supportingFiles &&
                      d.changes.supportingFiles.length > 0 && (
                        <div className={styles.files}>
                          <header>
                            <h6>Supporting Files</h6>
                          </header>
                          <Files
                            id={data._id}
                            ids={d.changes.supportingFiles}
                            fileStatus={data.fileStatus}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </GridColumn>
      </Grid>
    </Page>
  );
}

Request.propTypes = {
  data: RequestSchema.isRequired,
};

export default Request;
