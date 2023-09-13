export const reviewBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['text', 'rating', 'userId', 'itemId'],
    properties: {
      text: { type: 'string' },
      rating: { type: 'number' },
      userId: { type: 'string' },
      itemId: { type: 'string' },
    },
  },
};
