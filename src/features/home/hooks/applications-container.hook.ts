import { useMemo } from "react";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

export function useApplicationsData() {
  const applications = useMemo((): IMenuAccess[] =>
    [
      {
        id: 1,
        name: "Funcionalidad",
        order: 10,
        url: "/funcionalidad"
      },
      {
        id: 2,
        name: "Ruta presupuestal",
        order: 20,
        url: "/ruta-presupuestal"
      },
      {
        id: 3,
        name: "Centro Gestor",
        order: 30,
        url: "/centro-gestor"
      },
      {
        id: 4,
        name: "RP",
        order: 40,
        url: "/rp"
      },
      {
        id: 5,
        name: "Informes",
        order: 50,
        url: "/informes"
      },
      {
        id: 6,
        name: "Cierre",
        order: 60,
        url: "/cierre"
      },
    ], []);

  return { applications };
}
