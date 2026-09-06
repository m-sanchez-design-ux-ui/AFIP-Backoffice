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
  posId: string;
  serialNumber: string;
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

export const MOCK_COMPANIES = CUITS.map((cuit, i) => ({
  id: (i + 1).toString(),
  cuit,
}));

function companyPosEntries(companyId: string) {
  const base = Number(companyId) * 100;
  return [1, 2, 3].map((n) => ({ id: (base + n).toString(), pos: pad(n) }));
}

export function getMockCompanyPos(companyId: string) {
  return companyPosEntries(companyId);
}

// Every file belongs to a real (company, point of sale) combo above, so
// filtering by CUIT and then by point of sale behaves consistently end
// to end, the same way it would against a real backend.
export const MOCK_FILES: MockFileRow[] = (() => {
  const files: MockFileRow[] = [];
  const statusCycle = [1, 2, 3, 99];
  let counter = 0;

  MOCK_COMPANIES.forEach((company) => {
    companyPosEntries(company.id).forEach((posEntry) => {
      for (let k = 0; k < 2; k++) {
        counter++;
        const month = (counter % 12) + 1;
        files.push({
          cuit: company.cuit,
          pos: posEntry.pos,
          posId: posEntry.id,
          // AFIP-style serial number: point-of-sale id + a per-file
          // sequence, so it looks like a real controlador fiscal serial
          // instead of a placeholder.
          serialNumber: `${posEntry.id.padStart(5, '0')}${pad(k + 1, 3)}`,
          filename: `presentacion_${pad(counter)}.pem`,
          startDate: `2024-${pad(month, 2)}-01`,
          endDate: `2024-${pad(month, 2)}-07`,
          status: statusCycle[counter % statusCycle.length],
          fileId: counter.toString(),
        });
      }
    });
  });

  return files;
})();

export function paginateFiles(
  page: number,
  pageSize: number,
  filters: { cuit?: string; posId?: string; status?: string; search?: string }
): { total: number; results: MockFileRow[] } {
  let filtered = MOCK_FILES;

  if (filters.cuit) {
    filtered = filtered.filter((f) => f.cuit.includes(filters.cuit!));
  }
  if (filters.posId) {
    filtered = filtered.filter((f) => f.posId === filters.posId);
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

  // The stepper component always reads the LAST item of this array as the
  // file's current state, so it must stop exactly at the file's real
  // status — not always include every step.
  const baseDates: Record<number, string> = {
    1: '2024-01-15T10:30:00',
    2: '2024-01-15T11:15:00',
    3: '2024-01-16T09:00:00',
    99: '2024-01-16T09:05:00',
  };

  // The stepper component has two completely separate render paths:
  // - If status[0].id === 99 (error code), it renders a dedicated
  //   "error" layout (a single-item array is enough — see
  //   stepper.component.html's `@if` branch).
  // - Otherwise, it walks `steps` (codes 1/2/3) and highlights the LAST
  //   item in this array as the current step.
  // So an errored file's history must be a single-item array starting
  // (and ending) with id 99 — not steps 1‑2 followed by 99.
  let statusHistory: { id: number; date: string }[];
  switch (file.status) {
    case 1:
      statusHistory = [{ id: 1, date: baseDates[1] }];
      break;
    case 2:
      statusHistory = [
        { id: 1, date: baseDates[1] },
        { id: 2, date: baseDates[2] },
      ];
      break;
    case 99:
      statusHistory = [{ id: 99, date: baseDates[99] }];
      break;
    case 3:
    default:
      statusHistory = [
        { id: 1, date: baseDates[1] },
        { id: 2, date: baseDates[2] },
        { id: 3, date: baseDates[3] },
      ];
      break;
  }

  return {
    filename: file.filename,
    cuit: file.cuit,
    pos: file.pos,
    status: statusHistory,
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

export function getMockConsolidatedFiles(
  page: number,
  pageSize: number,
  filters: { name?: string; startDate?: string; endDate?: string } = {}
) {
  let all = Array.from({ length: 8 }).map((_, i) => ({
    filename: `consolidado_${pad(i + 1)}.zip`,
    startDate: `2024-${pad((i % 12) + 1, 2)}-01`,
    endDate: `2024-${pad((i % 12) + 1, 2)}-07`,
    url: '#',
  }));

  if (filters.name) {
    const s = filters.name.toLowerCase();
    all = all.filter((f) => f.filename.toLowerCase().includes(s));
  }
  if (filters.startDate) {
    all = all.filter((f) => f.startDate >= filters.startDate!);
  }
  if (filters.endDate) {
    all = all.filter((f) => f.endDate <= filters.endDate!);
  }

  const total = all.length;
  const start = (page - 1) * pageSize;
  const results = all.slice(start, start + pageSize);

  return { total, results };
}

// --- Notifications (bell icon) --------------------------------------------
// NotificationsAlertService never calls a real backend for this — it just
// keeps notifications in memory/localStorage — so these are seeded directly
// into the service instead of through the HTTP interceptor.

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}

export const MOCK_NOTIFICATIONS = [
  {
    code: 'notif-1',
    status: 2,
    description: 'El archivo presentacion_0003.pem se presentó correctamente ante AFIP.',
    createdOn: minutesAgo(4),
  },
  {
    code: 'notif-2',
    status: 1,
    description: 'El archivo presentacion_0007.pem tuvo un error de importación. Compruebe el detalle del archivo.',
    createdOn: minutesAgo(35),
  },
  {
    code: 'notif-3',
    status: 2,
    description: 'El lote de comprobantes del punto de venta 0002 se importó correctamente.',
    createdOn: minutesAgo(130),
  },
  {
    code: 'notif-4',
    status: 2,
    description: 'Se generó el archivo consolidado_04.zip.',
    createdOn: minutesAgo(1500),
  },
];
