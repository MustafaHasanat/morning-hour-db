/* eslint-disable @typescript-eslint/no-unused-vars */

import { createItemBody } from './create-item.body';

const { required, ...schema } = createItemBody.schema;

export const updateItemBody = {
  schema,
};
