import * as React from 'react';
import { Link } from 'react-router-dom';

function RequestsList({ data }) {
  return (
    <div>
      <header>All Requests</header>
      <div>
        {data.map(d => (
          <Link key={d.id} to={`/requests/${d.id}`}>
            {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

RequestsList.defaultProps = {
  data: [],
};

export default RequestsList;
