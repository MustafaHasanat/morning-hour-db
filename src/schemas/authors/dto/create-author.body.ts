export const createAuthorBody = {
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
