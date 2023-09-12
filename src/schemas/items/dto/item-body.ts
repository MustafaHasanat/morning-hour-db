export const itemBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: [
      'title',
      'description',
      'currentPrice',
      'oldPrice',
      'isBestSelling',
      'primaryColor',
      'authorId',
      'image',
      'screenshots',
    ],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      currentPrice: { type: 'number' },
      oldPrice: { type: 'number' },
      isBestSelling: { type: 'boolean' },
      primaryColor: { type: 'string' },
      authorId: { type: 'string' },
      image: { type: 'string', format: 'binary' },
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
