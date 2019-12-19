import React from 'react';
import { action } from '@storybook/addon-actions';
import '@atlaskit/css-reset';

import Sidebar from '../sidebar';

export default { title: 'Request Sidebar' };

const props = {
  id: 'r101',
  isApprovingRequest: false,
  isSaving: false,
  onApproveRequest: action('Approve'),
  onDenyRequest: action('Deny'),
  onPickupRequest: action('Pickup Request'),
  onRequestRevisions: action('Request Revisions'),
  user: {
    id: 'reviewer-01',
  },
};

const unclaimedData = {
  _id: 'eb101',
  author: 'researcher-01',
  name: 'tst',
  reviewers: [],
  state: 1,
  exportType: 'data',
};
export const withUnclaimed = () => <Sidebar {...props} data={unclaimedData} />;

const claimedData = {
  _id: 'eb101',
  author: 'researcher-01',
  name: 'tst',
  reviewers: ['reviewer-01'],
  state: 3,
  exportType: 'data',
};
export const withClaimed = () => <Sidebar {...props} data={claimedData} />;
