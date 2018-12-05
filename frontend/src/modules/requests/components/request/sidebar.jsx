import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
// Icons
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import TrashIcon from '@atlaskit/icon/glyph/trash';

import { RequestSchema } from '../../types';

function RequestSidebar({
  data,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
  onWithdraw,
}) {
  return (
    <aside id="request-sidebar">
      <h6>Output Checker</h6>
      <div id="request-reviewers">
        {data.reviewers.map(d => (
          <p>
            <Avatar key={d} size="small" />
            {d}
          </p>
        ))}
      </div>
      {data.reviewers.length <= 0 && (
        <p id="request-reviewers-empty">No reviewer has been assigned</p>
      )}
      <h6>Actions</h6>
      {data.state >= 2 &&
        data.state < 4 && (
          <React.Fragment>
            <div>
              <Button
                appearance="link"
                id="request-sidebar-withdraw-button"
                iconBefore={<SignOutIcon />}
                onClick={() => onWithdraw(data._id)}
              >
                Withdraw Request
              </Button>
            </div>
            <div>
              <Button
                appearance="link"
                id="request-sidebar-cancel-button"
                iconBefore={<CrossIcon />}
                onClick={() => onCancel(data._id)}
              >
                Cancel Request
              </Button>
            </div>
          </React.Fragment>
        )}
      {data.state < 2 && (
        <React.Fragment>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-submit-button"
              isDisabled={data.state < 1 || data.files.length <= 0}
              iconBefore={<SignInIcon />}
              onClick={() => onSubmit(data._id)}
            >
              Submit Request
            </Button>
          </div>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-edit-button"
              iconBefore={<EditFilledIcon />}
              onClick={() => onEdit(data._id)}
            >
              Edit Request
            </Button>
          </div>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-delete-button"
              iconBefore={<TrashIcon />}
              onClick={() => onDelete(data._id)}
            >
              Delete Request
            </Button>
          </div>
        </React.Fragment>
      )}
    </aside>
  );
}

RequestSidebar.propTypes = {
  data: RequestSchema.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
};

export default RequestSidebar;
