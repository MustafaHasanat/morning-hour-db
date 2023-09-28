import { FilterOperator, SortDirection } from 'src/enums/sorting-fields.enum';

export interface GetAllProps {
  filteredTerm: string | number;
  filterOperator: FilterOperator;
  sortDirection: SortDirection;
  conditions: Record<string, any>;
}
