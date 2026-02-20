export type Mode = 'entrada' | 'entrega' | 'sorteo';

export interface ScanResult {
  id: string;
  timestamp: string;
  data: string;
  status: 'valid' | 'invalid';
  mode: Mode;
  name?: string;
}