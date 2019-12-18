import React from 'react';
import '@atlaskit/css-reset';

import Sidebar from '../sidebar';

export default { title: 'Request Sidebar' };

const props = {
  id: 1,
  isApprovingRequest: false,
  isSaving: false,
  onApproveRequest: () => console.log('hi'),
  onDenyRequest: () => console.log('hi'),
  onPickupRequest: () => console.log('hi'),
  onRequestRevisions: () => console.log('hi'),
  user: {
    id: 'reviewer-01',
  },
};

const unclaimedData = {
  _id: 1,
  author: 'researcher-01',
  name: 'tst',
  reviewers: [],
  state: 1,
  exportType: 'data',
};
export const withUnclaimed = () => <Sidebar {...props} data={unclaimedData} />;

const claimedData = {
  _id: 1,
  author: 'researcher-01',
  name: 'tst',
  reviewers: ['reviewer-01'],
  state: 3,
  exportType: 'data',
};
export const withClaimed = () => <Sidebar {...props} data={claimedData} />;
