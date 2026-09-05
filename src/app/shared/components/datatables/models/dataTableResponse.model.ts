export interface DatatablesResponse<Type> {
  total:   number;
  results: Type[];
}