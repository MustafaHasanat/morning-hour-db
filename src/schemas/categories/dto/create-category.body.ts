export const createCategoryBody = {
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
