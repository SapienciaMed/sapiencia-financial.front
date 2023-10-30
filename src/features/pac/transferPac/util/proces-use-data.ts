export function processUseData(use, arrayDataSelect, authorization) {
    const newArray = [];
    if (use.hasOwnProperty("collected")) {
      newArray.push({
        collected: use?.collected
      });
    }
    if (use.hasOwnProperty("programmed")) {
      newArray.push({
        programmed: use?.programmed
      });
    }
  
    const annualRoute = newArray
      .filter(obj => Object.values(obj).some(value => {
        if (typeof value === 'object') {
          return Object.values(value).some(subValue => subValue !== 0);
        }
        return false;
      }))
      .map(ob => {
        if (ob.hasOwnProperty("collected") && !ob.hasOwnProperty("programmed")) {
          return [
            transformData(ob.collected, "Recaudado", authorization),
            transformData(ob.collected, "Programado", authorization)
          ];
        } else if (ob.hasOwnProperty("programmed") && !ob.hasOwnProperty("collected")) {
          return [
            transformData(ob.programmed, "Recaudado", authorization),
            transformData(ob.programmed, "Programado", authorization)
          ];
        } else if (ob.hasOwnProperty("collected") && ob.hasOwnProperty("programmed")) {
          const collectedData = transformData(ob.collected, "Recaudado", authorization);
          const programmedData = transformData(ob.programmed, "Programado", authorization);
          return [collectedData, programmedData];
        }
      });
  
    return {
      managementCenter: use.managerCenter,
      idProjectVinculation: parseInt(use.projectId),
      idBudget: arrayDataSelect?.pospreSapiencia?.find(value => use.pospreSapiencia == value.id)?.idPosPreOrig,
      idPospreSapiencia: parseInt(use.pospreSapiencia),
      idFund: parseInt(use.fundsSapiencia),
      idCardTemplate: use.cardId,
      annualRoute,
    };
}
  

const transformData = (ob, type, authorization) => {
    return {
        type,
        jan: ob?.january,
        feb: ob?.february,
        mar: ob?.march,
        abr: ob?.april,
        may: ob?.may,
        jun: ob?.june,
        jul: ob?.july,
        ago: ob?.august,
        sep: ob?.september,
        oct: ob?.october,
        nov: ob?.november,
        dec: ob?.december,
        id: ob?.id,
        pacId: ob?.pacId,
        dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
        dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
    };
};