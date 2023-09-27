import { UserRole } from 'src/enums/user-role.enum';

export type TokenPayload = {
  userId: string;
  username: string;
  role: UserRole;
  email: string;
};

export type FullTokenPayload = TokenPayload & {
  iat: number;
  exp: number;
};
