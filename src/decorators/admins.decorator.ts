import { SetMetadata } from '@nestjs/common';
import constants from 'src/utils/constants/auth.constants';

export const AdminsOnly = () => SetMetadata(constants.IS_ADMINS_ONLY, true);
