import { Route, Routes } from "react-router-dom"
import { lazy } from "react";
import CdpMgaAssocPage from "./pages/cdp-mga-assoc.page";
import RoutesCdpEditPage from "./pages/routes-cdp-edit.page";


const BudgetAvailabilityRoutes = () => {

    const CdpPage = lazy(() => import("./pages/cdp.page"));
    const CdpCrudPage = lazy(() => import("./pages/cdp-crud.page"))
    const CdpViewPage = lazy(() => import("./pages/cdp-view.page"))
    const CdpAmountAssoc = lazy(() => import("./pages/cdp-amounts-assoc.page"))

    return (
        <Routes>
            <Route path={"/"} element={<CdpPage />} />
            <Route path={"/create"} element={ <CdpCrudPage /> } />
            <Route path={"/view/:id"} element={ <CdpViewPage /> } />
            <Route path={"/assoc-amounts/:id"} element={ <CdpAmountAssoc /> } />
            <Route path={"/view/:id/mga-assoc/:idRoute"} element={ <CdpMgaAssocPage /> } />
            <Route path={"/view/:id/edit/:idRoute"} element={ <RoutesCdpEditPage /> } />
        </Routes>
    )


}

export default BudgetAvailabilityRoutes;