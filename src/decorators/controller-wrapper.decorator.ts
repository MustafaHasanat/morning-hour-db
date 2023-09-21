import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

export const ControllerWrapper = (section: string) => {
  const capitalized = section.charAt(0).toUpperCase() + section.slice(1);

  return (target: any) => {
    Controller(section)(target);
    ApiTags(capitalized)(target);
    ApiBearerAuth()(target);
    ApiHeader({
      name: 'backend-access-token',
      description: 'provide the backend access token so you can make requests',
      required: false,
    })(target);
  };
};
