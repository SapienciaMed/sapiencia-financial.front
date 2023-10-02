import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import ViewVinculationMGA from "../pages/view-vinculation-mga";
import ViewPospreSapiencia from "../pages/view-pospre-sapiencia";
import { IBudgetViewPage } from "../../interfaces/Budgets";

export function useBudgetView( idBudget: string, option: string, values: IBudgetViewPage ) {

    const { actions, upDatePospreData, upDateVinculationData } = values;
   
    const tabs: ITabsMenuTemplate[] = [
        { 
            id: "vinculacion-mga", title: "Vinculación MGA", 
            content: <ViewVinculationMGA actions={actions} upDateVinculationData={upDateVinculationData}/>, 
            action: () => {}
        },
        { 
            id: "pospre-sapiencia", 
            title: "Pospre sapiencia", 
            content: <ViewPospreSapiencia actions={actions}/>, 
            action: () => {} 
        },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return {
        tabs,
        start
    }
}