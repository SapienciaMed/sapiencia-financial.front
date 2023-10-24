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
      return <>{row.amounts.length}</>;
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

export const tableActionsCdp: any[] = [
  {
    icon: "Detail",
    onClick: (row) => {},
  },
  {
    icon: "Edit",
    onClick: (row) => {},
  },
  {
    icon: "Add",
    onClick: (row) => {},
  },
  {
    icon: "Rp",
    onClick: (row) => {},
  },
];
