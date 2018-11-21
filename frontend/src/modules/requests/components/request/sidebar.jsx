import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
// Icons
import CrossIcon from '@atlaskit/icon/glyph/cross';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';

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
    <aside>
      <h6>Output Checker</h6>
      {data.reviewers.map(d => (
        <p>
          <Avatar key={d} size="small" />
          {d}
        </p>
      ))}
      {data.reviewers.length <= 0 && <p>No reviewer has been assigned</p>}
      <h6>Actions</h6>
      {data.state >= 2 &&
        data.state < 4 && (
          <React.Fragment>
            <div>
              <Button
                appearance="link"
                iconBefore={<SignOutIcon />}
                onClick={() => onWithdraw(data._id)}
              >
                Withdraw Request
              </Button>
            </div>
            <div>
              <Button
                appearance="link"
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
            <Button appearance="link" onClick={() => onSubmit(data._id)}>
              Submit
            </Button>
          </div>
          <div>
            <Button appearance="link" onClick={() => onEdit(data._id)}>
              Edit
            </Button>
          </div>
          <div>
            <Button appearance="link" onClick={() => onDelete(data._id)}>
              Delete
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
