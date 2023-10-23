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
}
