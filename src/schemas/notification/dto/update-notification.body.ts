import { createNotificationBody } from './create-notification.body';

/* eslint-disable @typescript-eslint/no-unused-vars */
const { required, ...schema } = createNotificationBody.schema;

export const updateNotificationBody = {
  ...createNotificationBody,
  schema,
};
