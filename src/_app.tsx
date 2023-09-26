import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";
import "./styles/_app.scss";
import "./styles/_theme-prime.css";
import "primereact/resources/primereact.min.css";
import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";
import useAppCominicator from "./common/hooks/app-communicator.hook";
import { ManagementCenterRoutes } from "./features/managementCenter/management-center-routes";
import { FunctionalityRoutes } from "./features/functionality/functionality-routes";

const Home = lazy(() => import("./features/home/pages/home.page"));
const BudgetRoutes = lazy(()  => import("./features/budget-routes/pages/budget-routes.page"));
const BudgetRoutesCrudPage = lazy(()  => import("./features/budget-routes/pages/budget-routes-crud.page"));

function App() {
  const { publish } = useAppCominicator();

  // Effect que cominica la aplicacion actual
  useEffect(() => {
    localStorage.setItem('currentAplication',process.env.aplicationId)
    setTimeout(
      () => publish("currentAplication", process.env.aplicationId),
      500
    );
  }, []);

  return (
    <AppContextProvider>
      <ModalMessageComponent />
      <ApplicationProvider> 
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path={"/*"} element={<Home/>} />

              <Route path={"/gestion-financiera/presupuesto/*"} element={<FunctionalityRoutes/>} />
              <Route path={"/gestion-financiera/centro-gestor/*"} element={<ManagementCenterRoutes/>} />

              <Route path={"/gestion-financiera/ruta-presupuestal"} element={<BudgetRoutes/>} />
              <Route path={"/gestion-financiera/ruta-presupuestal/create"} element={<BudgetRoutesCrudPage action="new"/>} />
              <Route path={"/gestion-financiera/ruta-presupuestal/edit/:id"} element={<BudgetRoutesCrudPage action="edit"/>} />
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default App;
