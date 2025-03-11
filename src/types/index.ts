
export interface InboundRecord {
  id: string;
  customerRecordId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  product: string;
  email: string;
  sender: string;
  received: string;
  source: string;
  subSource: string;
  market: string;
  notes: string;
  checkOutDate: string | null;
  checkedOutBy: string | null;
  isNew?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof InboundRecord;
  direction: SortDirection;
}

export interface FilterConfig {
  field: keyof InboundRecord | '';
  value: string;
}
