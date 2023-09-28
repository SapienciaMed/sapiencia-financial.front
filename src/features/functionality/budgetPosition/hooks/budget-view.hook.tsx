import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import ViewVinculationMGA from "../pages/view-vinculation-mga";
import ViewPospreSapiencia from "../pages/view-pospre-sapiencia";
import { IBudgetViewPage } from "../../interfaces/Budgets";

export function useBudgetView(idBudget: string, option: string, actions: IBudgetViewPage ) {
   
    const tabs: ITabsMenuTemplate[] = [
        { id: "vinculacion-mga", title: "Vinculación MGA", content: <ViewVinculationMGA actions={actions.actions}/>, action: () => {}},
        { id: "pospre-sapiencia", title: "Pospre sapiencia", content: <ViewPospreSapiencia/>, action: () => {} },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return {
        tabs,
        start
    }
}