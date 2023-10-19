import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

export const PacRoutes = () => {

    const TransferPacPage = lazy(()  => import("./transferPac/pages/transfer-pac-crud.page"));
    const PacCrud = lazy(()  => import("./createPac/page/pac-crud.page"));

    return (
        <Routes>

            <Route path='/traslado' element={<TransferPacPage/>}/>
            <Route path={"/cargar"} element={<PacCrud/>} />

        </Routes>
  )
}
