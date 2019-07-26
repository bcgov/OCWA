import * as React from 'react';
import PropTypes from 'prop-types';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import { Checkbox } from '@atlaskit/checkbox';
import MergeRequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ExportTypeIcon from '@src/components/export-type-icon';
import FlagFilledIcon from '@atlaskit/icon/glyph/flag-filled';
import get from 'lodash/get';
import LoadingDialog from '@src/components/loading-dialog';
import startCase from 'lodash/startCase';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { RequestSchema } from '@src/modules/requests/types';
import { _e } from '@src/utils';
import { uid } from 'react-uid';

import * as styles from './styles.css';

function Sidebar({
  data,
  id,
  isApprovingRequest,
  isSaving,
  onApproveRequest,
  onDenyRequest,
  onPickupRequest,
  onRequestRevisions,
  user,
}) {
  const assignedUser = get(data, 'reviewers[0]', '-');
  const isCodeExport = data.exportType === 'code';
  const isPreparing = isCodeExport && !data.mergeRequestLink;
  const mergeButtonText = isPreparing
    ? 'Preparing Merge Request'
    : 'View Merge Request';
  const [hasViewedMR, setViewed] = React.useState(false);
  const isDisabledActionButton = isCodeExport ? !hasViewedMR : false;

  React.useEffect(() => {
    setViewed(false);
  }, [data]);

  return (
    <React.Fragment>
      {isCodeExport && (
        <LoadingDialog
          open={isSaving && isApprovingRequest}
          title="Approving Request"
          text="This can take some time, please wait for the merge request to complete"
        />
      )}
      <aside className={styles.sidebar}>
        <h6>Requester</h6>
        <p id="request-author-text">{data.author}</p>
        <h6>{_e('{Request} Type', data.type)}</h6>
        <div id="request-exportType">
          <ExportTypeIcon exportType={data.exportType} />
          <span id="request-exportTypeText" className={styles.exportTypeText}>
            {startCase(get(data, 'exportType', 'data'))}
          </span>
        </div>
        <h6>Projects</h6>
        <div id="request-projects">
          {data.projects &&
            data.projects.map(p => (
              <p key={uid(p)} className="request-project-text">
                {p}
              </p>
            ))}
        </div>
        <h6>Reviewers</h6>
        {data.reviewers.length > 0 && (
          <p id="request-assigned-oc">{assignedUser}</p>
        )}
        {data.reviewers.length <= 0 && data.state < 3 && (
          <Button
            appearance="link"
            id="request-sidebar-pickup-button"
            iconBefore={<AddCircleIcon primaryColor="green" />}
            isDisabled={isSaving}
            onClick={() => onPickupRequest(id)}
          >
            Assign to Me
          </Button>
        )}
        {data.reviewers.includes(user.id) && data.state === 3 && (
          <React.Fragment>
            <h6>Actions</h6>
            {isCodeExport && (
              <React.Fragment>
                <Button
                  appearance="link"
                  id="request-sidebar-mergeRequestButton"
                  iconBefore={<MergeRequestsIcon primaryColor="green" />}
                  href={isCodeExport && data.mergeRequestLink}
                  target="_blank"
                >
                  {mergeButtonText}
                </Button>
                <div className={styles.checkbox}>
                  <Checkbox
                    value="viewed"
                    label="I have viewed the merge request"
                    onChange={event => setViewed(event.currentTarget.checked)}
                    name="viewed-mr"
                  />
                </div>
              </React.Fragment>
            )}
            <Button
              appearance="link"
              id="request-sidebar-approve-button"
              iconBefore={<CheckCircleIcon primaryColor="green" />}
              isDisabled={isSaving || isDisabledActionButton}
              onClick={() => onApproveRequest(id)}
            >
              Approve Request
            </Button>
            <Button
              appearance="link"
              id="request-sidebar-approve-button"
              iconBefore={<SelectClearIcon primaryColor="red" />}
              isDisabled={isSaving || isDisabledActionButton}
              onClick={() => onDenyRequest(id)}
            >
              Deny Request
            </Button>
            <Button
              appearance="link"
              id="request-sidebar-request-revisions-button"
              iconBefore={<FlagFilledIcon primaryColor="orange" />}
              isDisabled={isSaving}
              onClick={() => onRequestRevisions(id)}
            >
              Request Revisions
            </Button>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

Sidebar.propTypes = {
  data: RequestSchema.isRequired,
  id: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isApprovingRequest: PropTypes.bool.isRequired,
  onApproveRequest: PropTypes.func.isRequired,
  onDenyRequest: PropTypes.func.isRequired,
  onRequestRevisions: PropTypes.func.isRequired,
  onPickupRequest: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Sidebar;
