import { useNavigate } from "react-router-dom";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import PosPreSapienca from "../pages/pospre-sapiencia.page";

export function useLinkData(idBudget: string, option: string) {
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { id: "vinculacion-mga", title: "Vinculación MGA", content: <>aqui va tu pagina c:</>, action: () => { navigate(`/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/${idBudget}/vinculacion-mga`) } },
        { id: "pospre-sapiencia", title: "Pospre sapiencia", content: <PosPreSapienca />, action: () => { navigate(`/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/${idBudget}/pospre-sapiencia`) } },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return {
        tabs,
        start
    }
} 