import { SetMetadata } from '@nestjs/common';
import constants from 'src/utils/constants/auth.constants';

export const MembersOnly = () => SetMetadata(constants.IS_MEMBERS_ONLY, true);
