import { DateTime } from 'luxon';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';

export interface IPagoFilters {
  page: number;
  perPage: number;
  vinculacionRpCode: number;
  mes?: number;
  exercise?: string;
  dateOfCdp: string;
}

export interface IFiltersSelect {
}

export interface IPagoDataBasicEdit {
  vinculacionRpCode: number;
  valorCausado: number;
  valorPagado: number;
  usuarioCreo: string;
  fechaCreo: string;
  id?: number;
}

export interface IPagoDataSave {
    tipoDocumento: string;
    filedata: File;
    tipoArchivo: string;
    register: string;
    mesDelAnio: number;
    exercise?: string;
}

export interface IPagoDataBasicOriginalDataEdit {
  vinculacionRpCode: number;
  valorCausado: number;
  valorPagado: number;
  usuarioCreo: string;
  fechaCreo: string;
  id: number;
}

export interface IPagoDataBasicModifiedDataEdit {
  vinculacionRpCode?: number;
  valorCausado?: number;
  valorPagado?: number;
  usuarioCreo?: string;
  fechaCreo?: string;
}

export interface IPagoModel {
  id: number;
  vinculacionRpCode: number;
  valorCausado: number;
  valorPagado: number;
  usuarioCreo: string;
  fechaCreo: string;
}

export interface IMonthOption {
  id: number;
  value: number;
  name: string;
}


