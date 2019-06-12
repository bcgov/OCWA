import * as React from 'react';
import Button from '@atlaskit/button';
import DateTime from '@src/components/date';

export default ({ data, onSelectProject }) =>
  data.map(d => {
    const format = 'MMM Do, YYYY';

    return {
      key: `row-${d._id}`,
      cells: [
        {
          key: d.name,
          content: (
            <Button appearance="link" onClick={() => onSelectProject(d._id)}>
              {d.name}
            </Button>
          ),
        },
        {
          key: d.firstOutputDate,
          content: <DateTime value={d.firstOutputDate} format={format} />,
        },
        {
          key: d.lastOutputDate,
          content: <DateTime value={d.lastOutputDate} format={format} />,
        },
        {
          key: d.requests,
          content: d.requests,
        },
      ],
    };
  });
