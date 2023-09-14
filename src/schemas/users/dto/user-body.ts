export const userBody = {
  schema: {
    type: 'object',
    properties: {
      userName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      phoneNumber: { type: 'string' },
      gender: { type: 'string' },
      address: { type: 'string' },
      isAdmin: { type: 'boolean' },
      recentVisited: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      wishlist: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      cart: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
            },
            quantity: { type: 'number', example: 3 },
          },
        },
      },
      pricingRange: {
        type: 'object',
        properties: {
          max: { type: 'number', example: 50 },
          min: { type: 'number', example: 0 },
        },
      },
      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
