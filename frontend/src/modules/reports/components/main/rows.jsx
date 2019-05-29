import * as React from 'react';
import head from 'lodash/head';
import last from 'lodash/last';
import DateTime from '@src/components/date';
import RequestIcon from '@src/modules/requests/components/request-icon';
import { getRequestStateText } from '@src/modules/requests/utils';

const getAdjudicationDate = request => {
  const change = request.chronology.find(c => c.enteredState > 3);
  if (change) {
    return change.timestamp;
  }

  return '';
};

export default data => {
  return data.map(d => {
    const format = 'MMM Do, YYYY';
    const submittedOn = head(d.chronology).timestamp;
    const updatedOn = last(d.chronology).timestamp;
    const outputChecker = head(d.reviewers);
    const adjudicationDate = getAdjudicationDate(d);

    return {
      key: `row-${d._id}`,
      cells: [
        {
          key: d.state,
          content: <RequestIcon value={d.state} size="medium" />,
        },
        {
          key: d.name,
          content: d.name,
        },
        {
          key: submittedOn,
          content: <DateTime value={submittedOn} format={format} />,
        },
        {
          key: updatedOn,
          content: <DateTime value={updatedOn} format={format} />,
        },
        {
          key: adjudicationDate,
          content: adjudicationDate && (
            <DateTime value={adjudicationDate} format={format} />
          ),
        },
        {
          key: d.state,
          content: getRequestStateText(d.state),
        },
        {
          key: outputChecker,
          content: outputChecker || <em>Unassigned</em>,
        },
        {
          key: d.files.length,
          content: d.files.length,
        },
      ],
    };
  });
};
