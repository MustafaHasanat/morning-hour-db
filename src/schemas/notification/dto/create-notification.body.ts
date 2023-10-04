export const createNotificationBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['user', 'content'],
    properties: {
      user: { type: 'string' },
      content: { type: 'string' },
    },
  },
};
