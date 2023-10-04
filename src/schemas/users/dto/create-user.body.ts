import { UserGender } from 'src/enums/user-gender.enum';
import { UserRole } from 'src/enums/user-role.enum';

export const createUserBody = {
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  schema: {
    type: 'object',
    required: ['userName', 'email', 'password'],
    properties: {
      userName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      phoneNumber: { type: 'string' },
      gender: {
        type: 'string',
        enum: [UserGender.MALE, UserGender.FEMALE, UserGender.NOT_SPECIFIED],
        default: UserGender.NOT_SPECIFIED,
      },
      address: { type: 'string' },
      role: {
        type: 'string',
        enum: [UserRole.ADMIN, UserRole.MEMBER],
        default: UserRole.MEMBER,
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
