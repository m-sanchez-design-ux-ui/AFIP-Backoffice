// ---------------------------------------------------------------------------
// DEMO MOCK DATA
// ---------------------------------------------------------------------------
// This file exists only in this portfolio-demo fork of the project.
// It replaces the real backend responses so the app can run standalone,
// without access to the client's actual API or database.
// No real client data is used here — every value below is fictional.
// ---------------------------------------------------------------------------

export interface MockFileRow {
  cuit: string;
  pos: string;
  filename: string;
  startDate: string;
  endDate: string;
  status: number; // 1 = Creado, 2 = En la nube, 3 = Presentado, 99 = Error
  fileId: string;
}

const CUITS = ['30-70778626-0', '30-71234567-4', '30-69988776-1', '30-70555222-9'];

function pad(n: number, size = 4): string {
  return n.toString().padStart(size, '0');
}

export const MOCK_FILES: MockFileRow[] = Array.from({ length: 24 }).map((_, i) => {
  const statusCycle = [1, 2, 3, 99];
  const status = statusCycle[i % statusCycle.length];
  const cuit = CUITS[i % CUITS.length];
  const monthStart = (i % 12) + 1;
  const startDate = `2024-${pad(monthStart, 2)}-01`;
  const endDate = `2024-${pad(monthStart, 2)}-07`;

  return {
    cuit,
    pos: pad(i + 1),
    filename: `presentacion_${pad(i + 1)}.pem`,
    startDate,
    endDate,
    status,
    fileId: (i + 1).toString(),
  };
});

export function paginateFiles(
  page: number,
  pageSize: number,
  filters: { cuit?: string; status?: string; search?: string }
): { total: number; results: MockFileRow[] } {
  let filtered = MOCK_FILES;

  if (filters.cuit) {
    filtered = filtered.filter((f) => f.cuit.includes(filters.cuit!));
  }
  if (filters.status) {
    filtered = filtered.filter((f) => f.status === Number(filters.status));
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.filename.toLowerCase().includes(s) || f.cuit.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const results = filtered.slice(start, start + pageSize);

  return { total, results };
}

export function getMockFileDetail(fileId: string) {
  const file =
    MOCK_FILES.find((f) => f.fileId === fileId) ?? MOCK_FILES[0];

  return {
    filename: file.filename,
    cuit: file.cuit,
    pos: file.pos,
    status: [
      { id: 1, date: '2024-01-15T10:30:00' },
      { id: 2, date: '2024-01-15T11:15:00' },
      { id: 3, date: '2024-01-16T09:00:00' },
      ...(file.status === 99
        ? [{ id: 99, date: '2024-01-16T09:05:00' }]
        : []),
    ],
    audit: {
      f8011: {
        companyName: 'Empresa Demo S.A.',
        cuit: file.cuit,
        posNumber: Number(file.pos),
        fiscalDetails: {
          dayDetails: Array.from({ length: 6 }).map((_, i) => ({
            date: `2024-01-${pad(i + 1, 2)}T00:00:00`,
            type: (i % 3) + 1,
            firstReceipt: 1000 + i * 10,
            lastReceipt: 1009 + i * 10,
            receiptQuantity: 10,
            number: pad(i + 1, 8),
            taxedAmount: (15000 + i * 500).toFixed(2),
            untaxedAmount: (500 + i * 20).toFixed(2),
            exemptAmount: (0).toFixed(2),
            totalAmount: (15500 + i * 520).toFixed(2),
            cancelledReceiptQuantity: 0,
          })),
          receiptQuantity: 60,
          taxedAmount: '93000.00',
          untaxedAmount: '3600.00',
          exemptAmount: '0.00',
          totalAmount: '96600.00',
          cancelledReceiptQuantity: 0,
        },
      },
    },
  };
}

export function getMockConsolidatedFiles(page: number, pageSize: number) {
  const all = Array.from({ length: 8 }).map((_, i) => ({
    filename: `consolidado_${pad(i + 1)}.zip`,
    startDate: `2024-${pad((i % 12) + 1, 2)}-01`,
    endDate: `2024-${pad((i % 12) + 1, 2)}-07`,
    url: '#',
  }));

  const total = all.length;
  const start = (page - 1) * pageSize;
  const results = all.slice(start, start + pageSize);

  return { total, results };
}
