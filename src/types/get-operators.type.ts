import { FilterOperator } from 'src/enums/tables-fields.enum';

export type GetConditionsProps<FieldType> = {
  filteredTerm: {
    dataType: 'string' | 'number';
    value: string | number;
  };
  filterOperator: FilterOperator;
  field: FieldType;
};

export type GetAllProps<FieldType> = {
  conditions: GetConditionsProps<FieldType>[];
  sortBy?: FieldType;
  reverse?: boolean;
  page?: number;
};

export type GetQueryProps<FieldType> = {
  sortBy: FieldType;
  reverse: string;
  page: number;
  conditions: string[];
};
