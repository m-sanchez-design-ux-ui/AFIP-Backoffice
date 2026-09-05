export interface IFileDetail {
  status: Status[];
  filename: string;
  cuit: string;
  pos: string;
  audit: Audit;
}

export interface Audit {
  f8011: F8011;
}

export interface F8011 {
  companyName: string;
  cuit: string;
  posNumber: number;
  fiscalDetails: FiscalDetails;
}

export interface FiscalDetails {
  dayDetails: DayDetail[];
  receiptQuantity: number;
  taxedAmount: string;
  untaxedAmount: string;
  exemptAmount: string;
  totalAmount: string;
  cancelledReceiptQuantity: number;
}

export interface DayDetail {
  date: Date;
  type: number;
  firstReceipt: number;
  lastReceipt: number;
  receiptQuantity: number;
  taxedAmount: string;
  number: string;
  untaxedAmount: string;
  exemptAmount: string;
  totalAmount: string;
  cancelledReceiptQuantity: number;
}

export interface Status {
  id: number;
  date: Date;
}
