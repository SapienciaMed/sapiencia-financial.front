import { Route, Routes } from "react-router-dom"
import { lazy } from "react";
import CdpMgaAssocPage from "./pages/cdp-mga-assoc.page";


const BudgetAvailabilityRoutes = () => {

    const CdpPage = lazy(() => import("./pages/cdp.page"));
    const CdpCrudPage = lazy(() => import("./pages/cdp-crud.page"))
    const CdpViewPage = lazy(() => import("./pages/cdp-view.page"))

    return (
        <Routes>
            <Route path={"/"} element={<CdpPage />} />
            <Route path={"/create"} element={ <CdpCrudPage /> } />
            <Route path={"/view/:id"} element={ <CdpViewPage /> } />
            <Route path={"/view/:id/mga-assoc/:idRoute"} element={ <CdpMgaAssocPage /> } />
            <Route path={"/view/:id/edit/:idRoute"} element={ <CdpCrudPage /> } />
        </Routes>
    )


}

export default BudgetAvailabilityRoutes;