import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";

export const useReportService = () => {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/reports";
  const { post } = useCrudService(baseURL);

  async function generateExcelReport(
    reportId: string,
    year: number
  ): Promise<ApiResponse<any>> {
    const endpoint: string = `/generate-basic-excel`;
    return post<ApiResponse<any>>(`${roleUrl}${endpoint}`, {
      reportId,
      year,
    });
  }

  return {
    generateExcelReport,
  };
};
