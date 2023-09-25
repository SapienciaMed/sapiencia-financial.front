import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";


export const ManagementCenterRoutes = () => {

  const ManagementCenterAdditionalPage =  lazy(() => import("./pages/management-center-additional.page"));
  const AdditionAreaCrudPage = lazy(() => import("./pages/addition-area-crud.page"))
  
  const ManagementCenterTransferPage = lazy(() => import("./transfer/pages/management-center-transfer.page"));
  const TransferAreaCrudPage = lazy(() => import("./transfer/pages/transfer-area-crud.page"))
  const AddFundsCrudPage = lazy(() => import("./transfer/pages/add-funds-crud.page"))
  
  const ManagementCenterDecreasePage =  lazy(() => import("./pages/management-center-decrease.page"));
  

  return (
    <Routes>
      <Route path={"/adicion"} element={<ManagementCenterAdditionalPage />} />
      <Route path={"/adicion/create"} element={<AdditionAreaCrudPage actionForm="new" typeMovement="Adicion"/>} />

      <Route path={"/traslado"} element={<ManagementCenterTransferPage/> } />
      <Route path={"/traslado/create"} element={<TransferAreaCrudPage actionForm="new"/>} />
      <Route path={"/traslado/create/anadir-fondos"} element={<AddFundsCrudPage/>} />

      <Route path={"/disminucion"} element={<ManagementCenterDecreasePage/>} />
      <Route path={"/disminucion/create"} element={<AdditionAreaCrudPage actionForm="new" typeMovement="Disminucion"/>} />
    </Routes>
  )
}
