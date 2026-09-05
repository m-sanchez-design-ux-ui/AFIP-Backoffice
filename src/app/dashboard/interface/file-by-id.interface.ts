export interface IFileByIDResponse {
  status: Status[];
  filename: string;
  cuit: string;
  pos: string;
}

export interface Status {
  id: number;
  date: Date;
}
