import * as React from 'react';
import DateTime from '@src/components/date';
import { Link } from 'react-router-dom';
import RequestIcon from '@src/modules/requests/components/request-icon';
import { getRequestStateText } from '@src/modules/requests/utils';

export default data =>
  data.map(d => {
    const format = 'MMM Do, YYYY';

    return {
      key: `row-${d._id}`,
      cells: [
        {
          key: d.state,
          content: <RequestIcon value={d.state} size="medium" />,
        },
        {
          key: d.name,
          content: <Link to={`/view/${d._id}`}>{d.name}</Link>,
        },
        {
          key: d.firstSubmittedDate,
          content: <DateTime value={d.firstSubmittedDate} format={format} />,
        },
        {
          key: d.approvedDate,
          content: d.approvedDate ? (
            <DateTime value={d.approvedDate} format={format} />
          ) : (
            'N/A'
          ),
        },
        {
          key: d.daysUntilApproval,
          content: d.daysUntilApproval,
        },
        {
          key: d.submissionsCount,
          content: d.submissionsCount,
        },
        {
          key: d.revisionsCount,
          content: d.revisionsCount,
        },
        {
          key: d.state,
          content: getRequestStateText(d.state),
        },
        {
          key: d.outputChecker,
          content: d.outputChecker || <em>Unassigned</em>,
        },
        {
          key: d.files.length,
          content: d.files.length,
        },
      ],
    };
  });
