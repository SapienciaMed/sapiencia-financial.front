import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";

export const validateTypePac = (watchAll: ICreateTransferPacForm) => {

    const hasNonEmptyAll = watchAll.origen?.concat(watchAll?.destino)?.some(item => {
        return (item.managerCenter !='' && item.managerCenter != undefined) 
            || (item.functionalArea !='' && item.functionalArea != undefined)
            || (item?.funds !=''  && item?.funds != undefined)
            || (item?.projectName !='' && item?.projectName != undefined)
            || (item?.fundsSapiencia !='' && item?.fundsSapiencia != undefined)
            || (item?.pospreSapiencia !='' && item?.pospreSapiencia != undefined)
    });

    const hasDataBeforeReset: boolean = watchAll?.origen?.concat(watchAll.destino)?.some(item => {
        const collectedValues = Object.values(item.collected);
        const programmedValues= Object.values(item.programmed)
        return collectedValues.some(value => value !== "") || programmedValues.some(value => value !== "")
    });

    return { hasDataBeforeReset, hasNonEmptyAll };
}

