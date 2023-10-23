export const clearRequestFilters = (data: any) => {
  Object.keys(data).forEach((key) => {
    if (!data[key] || data[key].length === 0) delete data[key];
  });
};

export const filterDataSelect = (data: any[]) => {
  const pospreIds = [];
  const fundIds = [];
  const projectIds = [];

  data.forEach((item) => {
    item.amounts.forEach((amount) => {
      if (amount.budgetRoute) {
        const pospreId = amount.budgetRoute.pospreSapiencia.id;
        const fundId = amount.budgetRoute.fund.id;
        const projectId = amount.budgetRoute.projectVinculation.id;

        if (!pospreIds.find((item) => item.id === pospreId)) {
          pospreIds.push({
            id: pospreId,
            value: pospreId.toString(),
            name: pospreId.toString(),
          });
        }

        if (!fundIds.find((item) => item.id === fundId)) {
          fundIds.push({
            id: fundId,
            value: fundId.toString(),
            name: fundId.toString(),
          });
        }

        if (!projectIds.find((item) => item.id === projectId)) {
          projectIds.push({
            id: projectId,
            value: projectId.toString(),
            name: projectId.toString(),
          });
        }
      }
    });
  });

  const result = {
    pospreId: pospreIds,
    fundId: fundIds,
    projectId: projectIds,
  };

  return result;
};
