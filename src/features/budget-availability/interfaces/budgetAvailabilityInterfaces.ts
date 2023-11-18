import { DateTime } from "luxon";
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';

export interface IBudgetsAvailabilityFilters {
  page: number;
  perPage: number;
  dateOfCdp: string;
  consecutiveSap?: string;
  consecutiveAurora?: string;
  projectId?: string;
  fundId?: string;
  pospreId?: string;
  initialDate?: string;
  endDate?: string;
  contractObject?: string;
}

export interface IFiltersSelect {
  pospreId: any[];
  fundId: any[];
  projectId: any[];
}

export interface IBudgetAvalaibility {
  id?: number;
  exercise: string;
  date: DateTime;
  contractObject: string;
  consecutive: number;
  sapConsecutive: number;
  rpAssoc?: string;
  amounts: IAmounts[];
}

interface IAmounts {
  id?: number;
  exercise: string;
  cdpCode: number;
  idRppCode: number;
  cdpPosition: number;
  amount: number;
  rpAssocs?: string;
  isActive: boolean;
  reasonCancellation: string;
}

export interface IBudgetAvalaibilityDataBasicEdit {
  date: string;
  contractObject: string;
  sapConsecutive: number;
  id?: number;
  exercise?: string;
  consecutive?: number;
  monthExercise?: string;
}

export interface IBudgetAvalaibilityDataBasicOriginalDataEdit {
  amount: any[];
  consecutive: number;
  contractObject: string;
  date: string;
  exercise: string;
  id: number;
  sapConsecutive: number;
}

export interface IBudgetAvalaibilityDataBasicModifiedDataEdit {
  contractObject?: string;
  date?: string;
  sapConsecutive?: number;
}

export interface ICdpMgaAssoc{
  projectId?: string,
  fundsSapiencia?: string,
  pospreSapiencia?: string,
  idBudget?: string,
  finalValue?: string,
  DetailedActivityMGA: string,
  cpc: string,
  percentageAffected: string
}

export interface ICdpMgaAssocFromProps {
  control: Control<ICdpMgaAssoc, any>,
  errors: FieldErrors<ICdpMgaAssoc>,
  arrayDataSelect: {
      listDetailedActivityMGA: any[];
  },
  disableAddButton: boolean,
  arrayMgaAssoc: any[],
  register: UseFormRegister<ICdpMgaAssoc>,
  onSubmit: (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>,
  deleteElement: (idToDelete: any) => void
  activities: any
}
