import { Route, Routes } from "react-router-dom"
import { lazy } from "react";


const BudgetAvailabilityRoutes = () => {

    const CdpPage = lazy(() => import("./pages/cdp.page"));
    const CdpCrudPage = lazy(() => import("./pages/cdp-crud.page"))
    const CdpViewPage = lazy(() => import("./pages/cdp-view.page"))

    return (
        <Routes>
            <Route path={"/"} element={<CdpPage />} />
            <Route path={"/create"} element={ <CdpCrudPage /> } />
            <Route path={"/view"} element={ <CdpViewPage /> } />
        </Routes>
    )


}

export default BudgetAvailabilityRoutes;