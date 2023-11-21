import { IAuthorization } from "../../../../common/interfaces/auth.interfaces";
import { IBudgets } from "../../interfaces/Budgets";
import { IPosPreSapiencia } from "../../interfaces/PosPreSapiencia";
import { IVinculationMgaV2 } from "../../interfaces/VinculationMGAInterfaces";

export default function insterDataBudgetsUpdate(data: IBudgets, vinculationMGA: IVinculationMgaV2[], authorization: IAuthorization, budgetsId: string, pospreSapi?: IPosPreSapiencia[],) {
   
    const currentDate = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${year}-${month<10 ? '0'+month :  month}-${ day<10 ? '0'+day :  day}`
    }

    const inserData = {
        pospreorig: {
            id: budgetsId,
            entityId: data.entityId,
            ejercise: data.ejercise,
            number: data.number,
            denomination: data.denomination,
            description: data.description,
            userModify: authorization.user.numberDocument,
            dateModify: currentDate()
        },
        vinculationmga: vinculationMGA?.map(obje => ({
            ...obje,
            budgetsId: budgetsId
        })),
        pospresapi: pospreSapi?.map(obje => ({
            ...obje,
            budgetsId: budgetsId
        })),
    }
   
    return inserData

}