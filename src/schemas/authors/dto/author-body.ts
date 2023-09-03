export const authorBody = {
  schema: {
    type: 'object',
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
