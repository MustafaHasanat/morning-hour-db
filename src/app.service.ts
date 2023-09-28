import { Injectable } from '@nestjs/common';
import {
  AuthorFields,
  CategoryFields,
  FilterOperator,
  ItemFields,
  OrderFields,
  ReviewFields,
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
    field,
    filteredTerm,
    filterOperator,
    sortDirection,
    conditions,
  }: {
    field:
      | AuthorFields
      | CategoryFields
      | ItemFields
      | OrderFields
      | ReviewFields
      | UserFields;
  } & GetAllProps) {
    const isConditions = !!Object.keys(conditions).length;

    const isNumber = [
      FilterOperator.MORE,
      FilterOperator.MORE_EQ,
      FilterOperator.LESS,
      FilterOperator.LESS_EQ,
      FilterOperator.EQUALS,
    ].includes(filterOperator);

    if (isNumber && typeof filteredTerm === 'string') {
      return null;
    }

    const where = isNumber
      ? { [field]: this.mappedOperators(filteredTerm as number) }
      : { [field]: Like(`%${filteredTerm}%`) };

    return {
      where: !isConditions ? where : conditions,
      order: { [field]: sortDirection },
    };
  }
}
