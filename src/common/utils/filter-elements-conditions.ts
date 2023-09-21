import { ICreateSourceForm } from "../../features/managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { IArrayDataSelect } from "../interfaces/global.interface";
import { generarIdAleatorio } from "./randomGenerate";

export function filterElementsMeetConditions(arrayDataSelect: IArrayDataSelect, data: ICreateSourceForm): any[] {

  const functionalArea = (type) => {
    return arrayDataSelect?.functionalArea.filter(item1 => {
      return type?.some(item2 => {
        const valueMatch = item1?.value == parseInt(item2.projectId);
        const areaMatch = item1?.area ? item1?.area[0]?.value == parseInt(item2.functionalArea) : false;
        return valueMatch && areaMatch;
      });
    })[0].area[0].name
  }

  const namesMatchingFunds = (type) => {
    return arrayDataSelect?.funds.filter(item1 => 
      type.some(item2 => item1?.value ? item1?.value == parseInt(item2.funds) : false)
    ).map(item => item.name)[0]
  }

  const namesMatchingPospre = (type) => {
    return arrayDataSelect?.posPre.filter(item1 => 
      type.some(item2 => item1?.value ? item1?.value == parseInt(item2.posPre) : false)
    ).map(item => item.name)[0]
  }

  const namesMatchingProject = (type) => {
    return arrayDataSelect?.functionalArea.filter(item1 => 
      type.some(item2 => item1?.value ? item1?.value == parseInt(item2.projectId) : false)
    ).map(item => item.name)[0]
  }


  const resultado = [
    ...data.origen.map((item) => ({
      type: "Origen",
      managerCenter: item.managerCenter, 
      projectId: namesMatchingProject(data.origen),
      fundId: namesMatchingFunds(data.origen), 
      budgetPosition: namesMatchingPospre(data.origen),
      value: parseInt(item.value),
      nameProject: item.projectName,
      functionalArea: functionalArea(data.origen)
    })),
    ...data.destino.map((item) => ({
      type: "Destino",
      managerCenter: item.managerCenter,
      projectId: namesMatchingProject(data.origen),
      fundId: namesMatchingFunds(data.destino),
      budgetPosition: namesMatchingPospre(data.destino),
      value: parseInt(item.value),
      nameProject: item.projectName,
      functionalArea: functionalArea(data.destino)
    })),
  ];
    
  return [{
    id: generarIdAleatorio(20),
    data: resultado
  }]
}