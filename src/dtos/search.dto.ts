import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ type: 'object' })
  conditions: Record<string, any>;
}
