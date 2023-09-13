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
