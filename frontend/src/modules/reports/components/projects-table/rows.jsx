import * as React from 'react';
import Button from '@atlaskit/button';

export default ({ data, onSelectProject }) =>
  data.map(d => {
    return {
      key: `row-${d.id}`,
      cells: [
        {
          key: d.name,
          content: (
            <Button appearance="link" onClick={() => onSelectProject(d.name)}>
              {d.name}
            </Button>
          ),
        },
        {
          key: d.totalRequests,
          content: d.totalRequests,
        },
      ],
    };
  });
