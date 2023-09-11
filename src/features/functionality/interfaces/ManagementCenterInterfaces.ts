import { DateTime } from "luxon";
import { ITypeTransfers } from "../../managementCenter/transfer/interfaces/TypesTranfersInterfaces";

export interface IManagementCenter {
  id?: number;
  actSapiencia: string;
  actDistrict: string;
  value: string;
  userCreate?: string;
  dateCreate?: DateTime;
  transfers?: ITypeTransfers
}

export interface IManagementCenterFilters {
  page: number;
  perPage: number;
  actSapiencia?: string;
  actDistrict?: string;
  transfers?: ITypeTransfers
}
