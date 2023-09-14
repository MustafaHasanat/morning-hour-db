export const categoryBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['title', 'image'],
    properties: {
      title: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
