/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReviewBody } from './create-review.body';

const { required, ...schema } = createReviewBody.schema;

export const updateReviewBody = {
  ...createReviewBody,
  schema,
};
