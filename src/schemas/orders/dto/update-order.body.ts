import { createOrderBody } from './create-order.body';

/* eslint-disable @typescript-eslint/no-unused-vars */
const { required, ...schema } = createOrderBody.schema;

export const updateOrderBody = {
  schema,
};
