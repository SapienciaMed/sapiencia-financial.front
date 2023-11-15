import { Route, Routes } from "react-router-dom"
import { lazy } from "react";
import PaysPage from "./pages/pays.page";
/* import CdpMgaAssocPage from "./pages/cdp-mga-assoc.page";
import RoutesCdpEditPage from "./pages/routes-cdp-edit.page"; */


const PaysRoutes = () => {

    const PaysPage = lazy(() => import("./pages/pays.page"));
    const LoadPays = lazy(() => import("./pages/load-pays.page"));

    return (
        <Routes>
            <Route path={"/"} element={<PaysPage />} />
            <Route path={"/load-pays"} element={<LoadPays />} />

        </Routes>
    )


}

export default PaysRoutes;