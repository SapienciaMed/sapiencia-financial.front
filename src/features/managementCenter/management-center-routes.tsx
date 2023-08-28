import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from '../../../../sapiencia-core.front/src/common/components/Guard/auth-private-guard';


export const ManagementCenterRoutes = () => {

    const ManagementCenterAdditionalPage =  lazy(() => import("./pages/management-center-additional.page"));
    const ManagementCenterTransferPage = lazy(() => import("./pages/management-center-transfer.page"));

  return (
    <Routes>
        <Route
            path={"/adicion"}
            element={<ManagementCenterAdditionalPage />}
        />
        <Route
            path={"/traslado"}
            element={<ManagementCenterTransferPage/> }
        />
        <Route
            path={"/disminucion"}
            element={
            <div>
                <h1>Disminucion</h1>
            </div>
            }
        />
    </Routes>
  )
}
