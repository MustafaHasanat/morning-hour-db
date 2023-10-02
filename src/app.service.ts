/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { GetAllProps } from './types/get-operators.type';
import {
  Like,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Equal,
  FindManyOptions,
} from 'typeorm';

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

  getFilteredQuery({
    sortBy,
    reverse,
    conditions,
  }: GetAllProps<
    | AuthorFields
    | CategoryFields
    | ItemFields
    | OrderFields
    | ReviewFields
    | UserFields
  >): FindManyOptions {
    try {
      const whereQuery = {};

      conditions.forEach((condition) => {
        const {
          field,
          filterOperator,
          filteredTerm: { dataType, value },
        } = condition;

        const isNumber = ![FilterOperator.CONTAINS].includes(filterOperator);

        if (isNumber && dataType === 'string') {
          return null;
        }

        const where = isNumber
          ? { [field]: this.mappedOperators(value as number) }
          : { [field]: Like(`%${value}%`) };

        whereQuery[field] = where[field];
      });

      return {
        where: { ...whereQuery },
        order: { [sortBy]: reverse ? SortDirection.DESC : SortDirection.ASC },
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
