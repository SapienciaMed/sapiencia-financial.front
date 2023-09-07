import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";


export const ManagementCenterRoutes = () => {

    const ManagementCenterAdditionalPage =  lazy(() => import("./pages/management-center-additional.page"));
    const AdditionAreaCrudPage = lazy(() => import("./pages/addition-area-crud.page"))

    const ManagementCenterTransferPage = lazy(() => import("./pages/management-center-transfer.page"));
    const TransferAreaCrudPage = lazy(() => import("./pages/transfer-area-crud.page"))

  return (
    <Routes>
        <Route path={"/adicion"} element={<ManagementCenterAdditionalPage />} />
        <Route path={"/adicion/create"} element={<AdditionAreaCrudPage actionForm="new"/>} />

        <Route path={"/traslado"} element={<ManagementCenterTransferPage/> } />
        <Route path={"/traslado/create"} element={<TransferAreaCrudPage actionForm="new"/>} />

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
