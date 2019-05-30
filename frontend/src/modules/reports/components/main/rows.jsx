import * as React from 'react';
import DateTime from '@src/components/date';
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
          content: d.name,
        },
        {
          key: d.submittedOn,
          content: <DateTime value={d.submittedOn} format={format} />,
        },
        {
          key: d.updatedOn,
          content: <DateTime value={d.updatedOn} format={format} />,
        },
        {
          key: d.adjudicationDate,
          content: d.adjudicationDate && (
            <DateTime value={d.adjudicationDate} format={format} />
          ),
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
