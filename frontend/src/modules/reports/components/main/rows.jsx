import * as React from 'react';
import Button from '@atlaskit/button';
import DateTime from '@src/components/date';
import { Link } from 'react-router-dom';
import RequestIcon from '@src/modules/requests/components/request-icon';
import { getRequestStateText } from '@src/modules/requests/utils';

export default ({ data, onSelectProject, onSelectRequester }) =>
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
          key: d.lastEditDate,
          content: <DateTime value={d.lastEditDate} format={format} />,
        },
        {
          key: d.daysActive,
          content: d.daysActive,
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
          key: d.author,
          content: (
            <Button
              appearance="link"
              onClick={() => onSelectRequester(d.author)}
            >
              {d.author}
            </Button>
          ),
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
