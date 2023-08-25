import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from '../../../../sapiencia-core.front/src/common/components/Guard/auth-private-guard';


export const ManagementCenterRoutes = () => {

    const ManagementCenterAdditionalPage =  lazy(() => import("../functionality/pages/management-center-additional.page"));
    const ManagementCenterPage = lazy(() => import("../functionality/pages/management-center.page"));

  return (
    <Routes>
        <Route
            path={"/adicion"}
            element={<ManagementCenterAdditionalPage />}
        />
        <Route
            path={"/traslado"}
            element={<ManagementCenterPage/> }
        />
         <Route
            path={"/traslado/:option"}
            element={<ManagementCenterPage/> }
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
