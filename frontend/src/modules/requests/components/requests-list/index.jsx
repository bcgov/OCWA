import * as React from 'react';
import { Link } from 'react-router-dom';

function RequestsList({ data }) {
  return (
    <div>
      <header>All Requests</header>
      <div>
        {data.map(d => (
          <div key={d._id}>
            <Link to={`/requests/${d._id}`}>{d.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

RequestsList.defaultProps = {
  data: [],
};

export default RequestsList;
