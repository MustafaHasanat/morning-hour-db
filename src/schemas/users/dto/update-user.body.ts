/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUserBody } from './create-user.body';

const { required, ...schema } = createUserBody.schema;

export const updateUserBody = {
  schema,
};
