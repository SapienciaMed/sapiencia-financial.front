import { useNavigate } from "react-router-dom";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import PosPreSapienca from "../pages/pospre-sapiencia.page";
import VinculacionMGA from "../pages/vinculationMGA.page";

export function useLinkData(idBudget: string, option: string) {
  const navigate = useNavigate();
  const tabs: ITabsMenuTemplate[] = [
    {
      id: "vinculacion-mga",
      title: "Vinculación MGA",
      content: <VinculacionMGA />,
      action: () => {
        navigate(
          `/gestion-financiera/presupuesto/posicion-presupuestaria/vinculacion/${idBudget}/vinculacion-mga`
        );
      },
    },
    {
      id: "pospre-sapiencia",
      title: "Pospre sapiencia",
      content: <PosPreSapienca />,
      action: () => {
        navigate(
          `/gestion-financiera/presupuesto/posicion-presupuestaria/vinculacion/${idBudget}/pospre-sapiencia`
        );
      },
    },
  ];
  const start = tabs.find(
    (tab) => tab.id.toString().toLowerCase() === option?.toLowerCase()
  );
  return {
    tabs,
    start,
  };
}
