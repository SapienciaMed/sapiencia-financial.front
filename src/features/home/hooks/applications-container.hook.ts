import { useMemo } from "react";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

export function useApplicationsData() {
  const applications = useMemo((): IMenuAccess[] =>
    [
      {
        id: 1,
        name: "Modulo de presupuesto",
        order: 10,
        url: ""
      },
    ], []);

  return { applications };
}
