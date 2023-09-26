import { ICreateSourceForm } from "../../features/managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { generarIdAleatorio } from "./randomGenerate";

export function transformJSONArrays(jsonArray: ICreateSourceForm): any[] {
    const resultado = [
      ...jsonArray.origen.map((item) => ({
        idCard: item.cardId,
        type: "Origen",
        managerCenter: item.managerCenter,
        projectId: parseInt(item.projectId),
        fundId: parseInt(item.funds),
        budgetPosition: parseInt(item.posPre),
        value: parseInt(item.value),
        nameProject: item.projectName
      })),
      ...jsonArray.destino.map((item) => ({
        idCard: item.cardId,
        type: "Destino",
        managerCenter: item.managerCenter,
        projectId: parseInt(item.projectId),
        fundId: parseInt(item.funds),
        budgetPosition: parseInt(item.posPre),
        value: parseInt(item.value),
        nameProject: item.projectName
      })),
    ];

    return [{
      id: generarIdAleatorio(20),
      data: resultado
    }];
  }