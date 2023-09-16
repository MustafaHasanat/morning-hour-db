import { SetMetadata } from '@nestjs/common';
import constants from 'src/utils/constants/auth.constants';

export const Public = () => SetMetadata(constants.IS_PUBLIC_KEY, true);
