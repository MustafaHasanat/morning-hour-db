export const itemBody = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      currentPrice: { type: 'number' },
      oldPrice: { type: 'number' },
      isBestSelling: { type: 'boolean' },
      primaryColor: { type: 'string' },
      authorId: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
      screenshots: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};
