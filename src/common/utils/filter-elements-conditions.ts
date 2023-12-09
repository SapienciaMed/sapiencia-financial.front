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
  console.log("***** ", arrayDataSelect);
  console.log("*****111 ", transferMovesGroups);
  const functionalArea = (type) => {
    const item = arrayDataSelect?.functionalArea?.find(
      (item) => item.id == type
    );
    if (item) {
      const areaItem = item?.area?.find((area) => area.projectId == type);
      return areaItem ? areaItem?.name : null;
    }
    return null;
  };

  const namesMatchingFunds = (type) => {
    const testFindNamesMatchingFunds = arrayDataSelect?.funds.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
    console.log({ testFindNamesMatchingFunds });

    return arrayDataSelect?.funds.find((item1) => item1.value == parseInt(type))
      ?.name;
  };

  const namesMatchingPospre = (type) => {
    const testFindNamesMatchingPosPre = arrayDataSelect?.posPre?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
    console.log({ testFindNamesMatchingPosPre });
    return arrayDataSelect?.posPre?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
  };

  const namesMatchingProject = (type) => {
    const testFindNamesMatchingProject = arrayDataSelect?.functionalArea?.find(
      (item1) => item1.value == parseInt(type)
    )?.name;
    console.log({ testFindNamesMatchingProject });
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
        functionalArea: functionalArea(it.functionalArea),
      })),
      id: item.id,
    })),
  ];

  return resultado;
}
