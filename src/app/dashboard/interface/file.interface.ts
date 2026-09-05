export interface IFileResponse {
  results: Result[];
  total: number;
}

export interface Result {
  cuit: string;
  pos: string;
  filename: string;
  startDate: Date;
  endDate: Date;
  status: number;
  fileId: string;
}
