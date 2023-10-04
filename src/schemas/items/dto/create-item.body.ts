export const createItemBody = {
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
      'author',
      'category',
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
      author: { type: 'string' },
      category: { type: 'string' },
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
