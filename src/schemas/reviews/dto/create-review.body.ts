export const createReviewBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['text', 'rating', 'user', 'item'],
    properties: {
      text: { type: 'string' },
      rating: { type: 'number' },
      user: { type: 'string' },
      item: { type: 'string' },
    },
  },
};
