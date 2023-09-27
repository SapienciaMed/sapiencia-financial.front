import { ICreateSourceForm } from "../../features/managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { IArrayDataSelect, ITransferMovesGroups } from "../interfaces/global.interface";
import { generarIdAleatorio } from "./randomGenerate";

export function filterElementsMeetConditions(arrayDataSelect: IArrayDataSelect, transferMovesGroups: ITransferMovesGroups[]): any[] {

  const functionalArea = (type) => {
    const item = arrayDataSelect?.functionalArea.find(item => item.id == type);
    if (item) {
      const areaItem = item.area.find(area => area.projectId == type);
      return areaItem ? areaItem.name : null;
    }
    return null;
  }

  const namesMatchingFunds = (type) => {
    return arrayDataSelect?.funds.find(item1 => item1?.value == parseInt(type))?.name
  }

  const namesMatchingPospre = (type) => {
    return arrayDataSelect?.posPre.find(item1 => item1?.value == parseInt(type))?.name
  }

  const namesMatchingProject = (type) => {
    return arrayDataSelect?.functionalArea.find(item1 => item1?.value == parseInt(type))?.name
  }


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
        functionalArea: functionalArea(it.functionalArea)
      })),
      id: item.id,
    })),
  ];
    
  return resultado
}