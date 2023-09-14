export const authorBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['name', 'brief', 'image'],
    properties: {
      name: { type: 'string' },
      brief: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
