import * as React from 'react';

function Details({ data }) {
  return (
    <div>
      <h6>Description</h6>
      <p>{data.description || 'No Description provided'}</p>
      <h6>Confidentiality</h6>
      <p>{data.confidentiality || 'No Confidentiality provided'}</p>
      <h6>Frequency</h6>
      <p>{data.freq || 'No Frequency provided'}</p>
      <h6>Purpose</h6>
      <p>{data.purpose || 'No Purpose provided'}</p>
      <h6>Selection Criteria</h6>
      <p>{data.selectionCriteria || 'No Selection Criteria provided'}</p>
      <h6>Variable Description</h6>
      <p>{data.variableDescription || 'No Variable Description provided'}</p>
    </div>
  );
}

export default Details;
