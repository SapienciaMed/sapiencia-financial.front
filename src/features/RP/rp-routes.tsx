
import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

export const RpRoutes = () => {
    const RpPages = lazy(()  => import("./pages/rp.pages"));
    return (
        <Routes>
            <Route path={'/rp'} element={<RpPages/>} />
        </Routes>
    )
}
