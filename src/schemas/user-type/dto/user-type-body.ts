import { UserRole } from 'src/types/user-role';

export const userTypeBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['userId', 'role'],
    properties: {
      userId: { type: 'string' },
      role: {
        type: 'string',
        enum: [UserRole.MEMBER, UserRole.ADMIN],
        default: UserRole.MEMBER,
      },
    },
  },
};
