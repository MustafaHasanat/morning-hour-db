import { FilterOperator } from 'src/enums/sorting-fields.enum';

export type GetConditionsProps<fieldType> = {
  filteredTerm: {
    dataType: 'string' | 'number';
    value: string | number;
  };
  filterOperator: FilterOperator;
  field: fieldType;
};

export type GetAllProps<fieldType> = {
  conditions: GetConditionsProps<fieldType>[];
  sortBy: fieldType;
  reverse: boolean;
};

export type GetQueryProps<fieldType> = {
  sortBy: fieldType;
  reverse: string;
  conditions: string[];
};
