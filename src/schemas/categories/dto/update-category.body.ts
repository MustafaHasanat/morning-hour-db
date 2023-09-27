/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCategoryBody } from './create-category.body';

const { required, ...schema } = createCategoryBody.schema;

export const updateCategoryBody = {
  schema,
};
