/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUserBody } from './create-user.body';

const { type, required, properties } = createUserBody.schema;
const { password, ...otherProperties } = properties;

export const updateUserBody = {
  ...createUserBody,
  schema: {
    type,
    properties: otherProperties,
  },
};
