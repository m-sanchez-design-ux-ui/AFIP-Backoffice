export interface IFilesConsolidatedList {
  results: Results;
}

export interface Results {
  total: number;
  results: Result[];
}

export interface Result {
  filename: string;
  startDate: Date;
  endDate: Date;
  url: string;
}
