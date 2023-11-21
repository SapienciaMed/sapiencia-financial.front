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
        const pospreValue = amount.budgetRoute.pospreSapiencia.number;
        const fundId = amount.budgetRoute.fund.id;
        const fundValue = amount.budgetRoute.fund.number;
        const projectId = amount.budgetRoute.projectVinculation.id;
        const projectValue = amount.budgetRoute.projectVinculation.type;

        if (!pospreIds.find((item) => item.id === pospreId)) {
          pospreIds.push({
            id: pospreId,
            value: pospreId,
            name: pospreValue,
          });
        }

        if (!fundIds.find((item) => item.id === fundId)) {
          fundIds.push({
            id: fundId,
            value: fundId,
            name: fundValue,
          });
        }

        if (!projectIds.find((item) => item.id === projectId)) {
          projectIds.push({
            id: projectId,
            value: projectId,
            name: projectValue,
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
