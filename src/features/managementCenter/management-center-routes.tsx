import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";


export const ManagementCenterRoutes = () => {

  const ManagementCenterAdditionalPage =  lazy(() => import("./pages/management-center-additional.page"));
  const AdditionAreaCrudPage = lazy(() => import("./pages/addition-area-crud.page"))
  
  const ManagementCenterTransferPage = lazy(() => import("./transfer/pages/management-center-transfer.page"));
  const TransferAreaCrudPage = lazy(() => import("./transfer/pages/transfer-area-crud.page"))
  const AddFundsCrudPage = lazy(() => import("./transfer/pages/add-funds-crud.page"))

  

  return (
    <Routes>
      <Route path={"/adicion"} element={<ManagementCenterAdditionalPage typeMovement="Adicion"/>} />
      <Route path={"/adicion/create"} element={<AdditionAreaCrudPage actionForm="new" typeMovement="Adicion"/>} />
      <Route path={"/adicion/edit/:id"} element={<AdditionAreaCrudPage actionForm="edit" typeMovement="Adicion"/>} />
      <Route path={"/adicion/detail/:id"} element={<AdditionAreaCrudPage actionForm="detail" typeMovement="Adicion"/>} />

      <Route path={"/traslado"} element={<ManagementCenterTransferPage/> } />
      <Route path={"/traslado/create"} element={<TransferAreaCrudPage actionForm="new"/>} />
      <Route path={"/traslado/edit/:id"} element={<TransferAreaCrudPage actionForm="edit"/>} />
      <Route path={"/traslado/view/:id"} element={<TransferAreaCrudPage actionForm="view"/>} />
      <Route path={"/traslado/create/anadir-traslado"} element={<AddFundsCrudPage/>} />
      <Route path={"/traslado/edit/:id/anadir-traslado"} element={<AddFundsCrudPage/>} />

      <Route path={"/disminucion"} element={<ManagementCenterAdditionalPage typeMovement="Disminucion"/>} />
      <Route path={"/disminucion/create"} element={<AdditionAreaCrudPage actionForm="new" typeMovement="Disminucion"/>} />
      <Route path={"/disminucion/edit/:id"} element={<AdditionAreaCrudPage actionForm="edit" typeMovement="Disminucion"/>} />
      <Route path={"/disminucion/detail/:id"} element={<AdditionAreaCrudPage actionForm="detail" typeMovement="Disminucion"/>} />
    </Routes>
  )
}
