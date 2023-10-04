export const createOrderBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['user', 'items'],
    properties: {
      user: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};
