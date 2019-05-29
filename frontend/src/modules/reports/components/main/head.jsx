export default {
  cells: [
    { content: ' ', width: 5 },
    {
      key: 'name',
      content: 'Request Name',
      shouldTruncate: true,
      isSortable: true,
    },
    { key: 'submittedOn', content: 'Submitted Date', isSortable: true },
    { key: 'updatedOn', content: 'Claimed Date', isSortable: true },
    { key: 'author', content: 'Adjudication date*', isSortable: true },
    {
      key: 'states',
      content: 'Current request status',
      isSortable: true,
    },
    { key: 'outputChecker', content: 'Checker name', isSortable: true },
    { key: 'totalFiles', content: 'Total Files', isSortable: true },
  ],
};
