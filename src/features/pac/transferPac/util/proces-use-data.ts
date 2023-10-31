import { IAuthorization } from "../../../../common/interfaces/auth.interfaces";
import { IAnnualRoute } from "../../interface/Pac";
import { IArrayDataSelectPac } from "../interfaces/TypeTransferPac";

export function processUseData(use, arrayDataSelect: IArrayDataSelectPac, authorization: IAuthorization, annualDataRoutesBot: IAnnualRoute[], cardId: any) {
    const newArray = [];

    if (use.hasOwnProperty("collected") && !use.hasOwnProperty("programmed")) {
      newArray.push({
        collected: use?.collected
      });
    }
    if (use.hasOwnProperty("programmed") && !use.hasOwnProperty("collected")) {
      newArray.push({
        programmed: use?.programmed
      });
    }

    if (use.hasOwnProperty("programmed") && use.hasOwnProperty("collected")) {
      newArray.push({
        collected: use?.collected,
        programmed: use?.programmed
      });
    }
  
    const annualRoute = newArray.map(ob => {
        if (Object.keys(ob.programmed).length == 0 && Object.keys(ob.collected).length > 0) {
          return [
            transformData(ob.collected, "Recaudado", authorization, annualDataRoutesBot, cardId),
            transformData(ob.collected, "Programado", authorization, annualDataRoutesBot, cardId)
          ];
        } 
        if (Object.keys(ob.programmed).length > 0 && Object.keys(ob.collected).length == 0) {
          return [
            transformData(ob.programmed, "Recaudado", authorization, annualDataRoutesBot, cardId),
            transformData(ob.programmed, "Programado", authorization, annualDataRoutesBot, cardId)
          ];
        } 
        if(Object.keys(ob.programmed).length > 0 && Object.keys(ob.collected).length > 0)  {
          const collectedData = transformData(ob.collected, "Recaudado", authorization, annualDataRoutesBot, cardId);
          const programmedData = transformData(ob.programmed, "Programado", authorization, annualDataRoutesBot, cardId);
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
  
const transformData = (ob, type: string, authorization: IAuthorization, annualDataRoutesBot: IAnnualRoute[], cardId: any) => {
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
    id: annualDataRoutesBot.find(us => us.cardId == cardId[0].cardId && us.type == type)?.id,
    pacId: ob?.pacId,
    dateModify: new Date(authorization.user.dateModify).toISOString().split('T')[0],
    dateCreate: new Date(authorization.user.dateCreate).toISOString().split('T')[0]
  };
};