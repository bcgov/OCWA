export default {
  cells: [
    { content: ' ', width: 5 },
    {
      key: 'name',
      content: 'Request Name',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'firstSubmittedDate',
      content: 'First Submission Date',
      isSortable: true,
    },
    { key: 'approvedDate', content: 'Approved Date', isSortable: true },
    {
      key: 'daysUntilApproval',
      content: 'Days Until Approval',
      isSortable: true,
    },
    { key: 'submissionsCount', content: 'Submissions', isSortable: true },
    { key: 'revisionsCount', content: 'Revisions', isSortable: true },
    {
      key: 'state',
      content: 'Current request status',
      isSortable: true,
    },
    { key: 'outputChecker', content: 'Checker name', isSortable: true },
    { key: 'totalFiles', content: 'Total Files', isSortable: true },
  ],
};
