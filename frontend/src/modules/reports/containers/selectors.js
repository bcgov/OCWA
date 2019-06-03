import differenceInDays from 'date-fns/difference_in_days';
import get from 'lodash/get';
import memoize from 'lodash/memoize';
import head from 'lodash/head';
import values from 'lodash/values';

export const makeRequest = memoize(
  request => {
    const createdAt = get(head(request.chronology), 'timestamp');
    const submissions = request.chronology.filter(d => d.enteredState === 2);
    const firstSubmittedDate = get(submissions, '[0].timestamp');
    const approvedDate = get(
      request.chronology.find(d => d.enteredState === 4),
      'timestamp'
    );
    const outputChecker = head(request.reviewers);
    const revisionsCount = request.chronology.reduce(
      (prev, d) => (d.enteredState === 5 ? prev + 1 : prev),
      0
    );
    const submissionsCount = request.chronology.reduce(
      (prev, d) => (d.enteredState === 2 ? prev + 1 : prev),
      0
    );
    const daysUntilApproval = approvedDate
      ? differenceInDays(approvedDate, firstSubmittedDate)
      : 'N/A';

    return {
      ...request,
      createdAt,
      firstSubmittedDate,
      approvedDate,
      outputChecker,
      revisionsCount,
      daysUntilApproval,
      submissionsCount,
    };
  },
  request => values(request).join()
);

export default {
  makeRequest,
};
