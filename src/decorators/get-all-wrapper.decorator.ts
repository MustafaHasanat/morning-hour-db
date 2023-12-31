import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { FilterOperator } from 'src/enums/tables-fields.enum';

export function GetAllWrapper({ fieldsEnum }: { fieldsEnum: SwaggerEnumType }) {
  return applyDecorators(
    ApiOperation({
      summary:
        "either search by multiple 'conditions' or by a single 'field' that 'contains' a string",
    }),
    ApiQuery({
      name: 'conditions',
      required: false,
      isArray: true,
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'enum', enum: Object.values(fieldsEnum) },
            filteredTerm: {
              type: 'object',
              properties: {
                dataType: { type: 'string' },
                value: { type: 'enum', enum: ['string', 'number'] },
              },
            },
            filterOperator: {
              type: 'enum',
              enum: Object.values(FilterOperator),
            },
          },
        },
      },
    }),
    ApiQuery({
      name: 'sortBy',
      type: 'enum',
      required: false,
      enum: fieldsEnum,
      example: Object.values(fieldsEnum)[0],
      description: 'select the field of which the results should ',
    }),
    ApiQuery({
      name: 'reverse',
      type: 'boolean',
      required: false,
      example: false,
      description: 'reverse the order of the rows',
    }),
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      example: 1,
      description: 'specify the number of the page (enter 0 to get all pages)',
    }),
  );
}
