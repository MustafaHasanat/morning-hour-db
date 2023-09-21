import { UsePipes, ValidationPipe, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';

export function CreateUpdateWrapper(dto: any, requestBody: { schema: any }) {
  return applyDecorators(
    ApiOkResponse({ type: dto }),
    UsePipes(ValidationPipe),
    ApiConsumes('multipart/form-data'),
    ApiBody(requestBody),
  );
}
