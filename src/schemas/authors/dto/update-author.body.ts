/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAuthorBody } from './create-author.body';

const { required, ...schema } = createAuthorBody.schema;

export const updateAuthorBody = {
  schema,
};
