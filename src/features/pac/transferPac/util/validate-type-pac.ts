import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";


export const validateTypePac = (watchAll: ICreateTransferPacForm, pacTypeState2: number) => {

    const hasNonEmptyCollected = watchAll.origen?.concat(watchAll?.destino)?.some(item => {
        const collectedValues = Object?.values(item?.collected);
        return collectedValues?.some(value => value !== "");
    });
    
    const hasNonEmptyProgrammed = watchAll.origen?.concat(watchAll?.destino).some(item => {
        const programmedValues = Object.values(item.programmed);
        return programmedValues.some(value => value !== "");
    });
    
    const hasDataBeforeReset: boolean = watchAll?.origen?.concat(watchAll.destino)?.some(item => {
        const collectedValues = Object.values(item.collected);
        const programmedValues= Object.values(item.programmed)

        return pacTypeState2 < 4 ? collectedValues.some(value => value !== "") || programmedValues.some(value => value !== "") : false
    });

    return { hasNonEmptyCollected, hasNonEmptyProgrammed, hasDataBeforeReset };
}

