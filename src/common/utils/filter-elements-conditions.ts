import { ICreateSourceForm } from "../../features/managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import {
  IArrayDataSelect,
  ITransferMovesGroups,
} from "../interfaces/global.interface";
import { generarIdAleatorio } from "./randomGenerate";

export function filterElementsMeetConditions(
  arrayDataSelect: IArrayDataSelect,
  transferMovesGroups: ITransferMovesGroups[]
): any[] {
  
  const functionalArea = (type) => {
    const item = Object(transferMovesGroups)[0].data[0]?.functionalArea==null 
    ? arrayDataSelect?.functionalArea?.find(item => item.id == type)
    : arrayDataSelect?.functionalArea?.find((item) =>
      item.area?.find((a) => a?.id == type)
    )
    if (item) {
      const areaItem = Object(transferMovesGroups)[0].data[0]?.functionalArea==null 
        ? item?.area?.find(area => area.projectId == type)
        : item?.area?.find((area) => area.id == type);
      return areaItem ? areaItem?.name : null;
    }
    return null;
  };
  const namesMatchingFunds = (type) => {
    const testFindNamesMatchingFunds = arrayDataSelect?.funds.find(
      (item1) => item1.value == parseInt(type)
    )?.name;

    return arrayDataSelect?.funds.find((item1) => item1.value == parseInt(type))
      ?.name;
  };

  const namesMatchingPospre = (type) => {
    const testFindNamesMatchingPosPre = arrayDataSelect?.posPre?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
    return arrayDataSelect?.posPre?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
  };

  const namesMatchingProject = (type) => {
    const testFindNamesMatchingProject = arrayDataSelect?.functionalArea?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
    return arrayDataSelect?.functionalArea?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
  };
  const resultado = [
    ...transferMovesGroups.map((item) => ({
      data: item.data.map((it) => ({
        type: it.type,
        managerCenter: it.managerCenter,
        projectId: namesMatchingProject(it.projectId),
        fundId: namesMatchingFunds(it.fundId),
        budgetPosition: namesMatchingPospre(it.budgetPosition),
        value: it.value,
        nameProject: it.nameProject,
        functionalArea: functionalArea(it.functionalArea ?? it.projectId),
      })),
      id: item.id,
    })),
  ];

  return resultado;
}
