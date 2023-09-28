import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { FilterOperator, SortDirection } from 'src/enums/sorting-fields.enum';

export function GetAllWrapper({ fieldsEnum }: { fieldsEnum: SwaggerEnumType }) {
  return applyDecorators(
    ApiOperation({
      summary:
        "either search by multiple 'conditions' or by a single 'field' that 'contains' a string",
    }),
    ApiQuery({
      name: 'field',
      type: 'enum',
      required: false,
      enum: fieldsEnum,
    }),
    ApiQuery({
      name: 'sortDirection',
      type: 'enum',
      required: false,
      enum: SortDirection,
    }),
    ApiQuery({
      name: 'filterOperator',
      type: 'enum',
      required: false,
      enum: FilterOperator,
    }),
    ApiQuery({
      name: 'filteredTerm',
      type: 'string | number',
      required: false,
    }),
    ApiQuery({ name: 'conditions', type: 'object', required: false }),
  );
}
