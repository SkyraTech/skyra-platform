export interface MockTransaction {
  id: string;
  reference: string;
  client: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
}

export const MOCK_TRANSACTIONS: MockTransaction[] = Array.from({ length: 45 }).map((_, i) => {
  const statuses = ['PAID', 'PENDING', 'OVERDUE', 'DRAFT'];
  const status = statuses[i % statuses.length] as any;
  const amounts = [1250, 450, 8900, 320, 15000];
  
  return {
    id: `tx-${1000 + i}`,
    reference: `INV-${2026}-${String(100 + i).padStart(3, '0')}`,
    client: `Client Company ${String.fromCharCode(65 + (i % 26))}`,
    amount: amounts[i % amounts.length] || 0,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0] || '',
    status,
  };
});
