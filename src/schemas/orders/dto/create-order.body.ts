export const createOrderBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['userId', 'items'],
    properties: {
      userId: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};
