import { useNavigate } from "react-router-dom";
import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import ViewVinculationMGA from "../pages/view-vinculation-mga";

export function useBudgetView(idBudget: string, option: string) {
   
    const tabs: ITabsMenuTemplate[] = [
        { id: "vinculacion-mga", title: "Vinculación MGA", content: <ViewVinculationMGA/>, action: () => {}},
        { id: "pospre-sapiencia", title: "Pospre sapiencia", content: <></>, action: () => {} },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return {
        tabs,
        start
    }
}