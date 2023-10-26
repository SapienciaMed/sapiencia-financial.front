import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'


export const PacRoutes = () => {

    const TransferPacPage = lazy(()  => import("./transferPac/pages/transfer-pac-crud.page"));
    const PacCrud = lazy(()  => import("./createPac/page/pac-crud.page"));
    const PacPages = lazy(()  => import("./pages/pac.pages"));
    const AssociatePacPages = lazy(() => import('./associatePac/pages/associate-pac.pages'))
    const PacEditPages = lazy(() => import('./pages/pac-edit.pages'))

    return (
        <Routes>
            <Route path={'/creacion-modificacion'} element={<PacPages/>} />
            <Route path={'/creacion-modificacion/traslado'} element={<TransferPacPage/>} />
            <Route path={'/creacion-modificacion/cargar'} element={<PacCrud/>} /> 
            <Route path={'/creacion-modificacion/asociar'} element={<AssociatePacPages/>} /> 
            <Route path={'/creacion-modificacion/edit/:option'} element={<PacEditPages/>} />
        </Routes>
  )
}
