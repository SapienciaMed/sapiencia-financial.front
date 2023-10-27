import { DateTime } from "luxon";

export const tableColumnsCdp: any[] = [
  {
    fieldName: "consecutive",
    header: "No. CDP Aurora",
  },
  {
    fieldName: "sapConsecutive",
    header: "No. CDP SAP",
  },
  {
    fieldName: "date",
    header: "Fecha documento",
    renderCell: (row) => {
      return <>{DateTime.fromISO(row.date).toLocaleString()}</>;
    },
  },
  {
    fieldName: "countRpp",
    header: "No. de rutas del CDP",
    renderCell: (row) => {
      const activeAmounts = row.amounts.filter((amount) => {
        return amount.isActive === 1;
      });

      return <>{activeAmounts.length}</>;
    },
  },
  {
    fieldName: "partnersRp",
    header: "RP asociados",
  },
  {
    fieldName: "contractObject",
    header: "Objeto contractual",
  },
];

export const initialFiltersSelect = {
  pospreId: [],
  fundId: [],
  projectId: [],
};

export const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
