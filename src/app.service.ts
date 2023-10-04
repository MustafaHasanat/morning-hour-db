import { Injectable } from '@nestjs/common';
import {
  AuthorFields,
  CategoryFields,
  FilterOperator,
  ItemFields,
  OrderFields,
  ReviewFields,
  SortDirection,
  UserFields,
} from './enums/sorting-fields.enum';
import { GetAllProps, GetConditionsProps } from './types/get-operators.type';
import {
  Like,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Equal,
  FindManyOptions,
} from 'typeorm';
import requestConstants from './utils/constants/request.constants';

@Injectable()
export class AppService {
  private mappedOperators(value: number) {
    return {
      moreThan: MoreThan(value),
      moreThanOrEqual: MoreThanOrEqual(value),
      lessThan: LessThan(value),
      lessThanOrEqual: LessThanOrEqual(value),
      equals: Equal(value),
    };
  }

  validateGetConditions<FieldType>(
    conditions: any,
  ): GetConditionsProps<FieldType>[] {
    if (conditions) {
      try {
        return conditions.map((condition: string) => JSON.parse(condition));
      } catch (error) {
        return [JSON.parse(`${conditions}`)];
      }
    }
  }

  filteredGetQuery({
    sortBy,
    reverse,
    page,
    conditions,
  }: GetAllProps<
    | AuthorFields
    | CategoryFields
    | ItemFields
    | OrderFields
    | ReviewFields
    | UserFields
  >): { message: string; data: FindManyOptions; status: number } {
    try {
      const whereQuery = {};

      if (page < 0) {
        return {
          message: 'Page number must be a positive integer or a zero',
          data: null,
          status: 400,
        };
      }

      conditions.forEach((condition) => {
        const {
          field,
          filterOperator,
          filteredTerm: { dataType, value },
        } = condition;

        const isNumber = ![FilterOperator.CONTAINS].includes(filterOperator);

        if (isNumber && dataType === 'string') {
          return {
            message:
              'The inputs (field, filterOperator, filteredTerm.dataType, filteredTerm.value) must be consistent',
            data: null,
            status: 400,
          };
        }

        const where = isNumber
          ? { [field]: this.mappedOperators(value as number) }
          : { [field]: Like(`%${value}%`) };

        whereQuery[field] = where[field];
      });

      const pageOptions =
        page === 0
          ? {}
          : {
              take: requestConstants.ITEMS_IN_PAGE,
              skip: requestConstants.ITEMS_IN_PAGE * (page - 1),
            };

      return {
        message: 'Data retrieved successfully',
        data: {
          where: { ...whereQuery },
          order: { [sortBy]: reverse ? SortDirection.DESC : SortDirection.ASC },
          ...pageOptions,
        },
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }
}
