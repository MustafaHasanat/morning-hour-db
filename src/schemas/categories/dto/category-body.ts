export const categoryBody = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
