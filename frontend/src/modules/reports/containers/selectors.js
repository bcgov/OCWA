import differenceInDays from 'date-fns/difference_in_days';
import get from 'lodash/get';
import last from 'lodash/last';
import memoize from 'lodash/memoize';
import head from 'lodash/head';
import sample from 'lodash/sample';
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
    const lastEditDate = get(last(request.chronology), 'timestamp');
    const submissionsCount = request.chronology.reduce(
      (prev, d) => (d.enteredState === 2 ? prev + 1 : prev),
      0
    );
    const daysActive = Math.max(
      1,
      differenceInDays(lastEditDate, firstSubmittedDate)
    );
    const daysUntilApproval = approvedDate
      ? Math.max(1, differenceInDays(approvedDate, firstSubmittedDate))
      : 'N/A';

    return {
      ...request,
      createdAt,
      firstSubmittedDate,
      approvedDate,
      daysActive,
      lastEditDate,
      outputChecker,
      revisionsCount,
      daysUntilApproval,
      submissionsCount,
      project: sample(['Project 1', 'Project 2']),
    };
  },
  request => values(request).join()
);

export default {
  makeRequest,
};
