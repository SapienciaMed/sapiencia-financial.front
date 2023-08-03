import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";
import "./styles/_app.scss";
import "./styles/_theme-prime.css";
import "primereact/resources/primereact.min.css";
import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";
import useAppCominicator from "./common/hooks/app-communicator.hook";

const Home = lazy(() => import("./features/home/pages/home.page"));
const Functionality = lazy(() => import("./features/functionality/pages/functionality.page"));
const FunctionalityCenterManagerPage = lazy(() => import("./features/functionality/pages/funcionality-center-manager.page"));
const FundsCrud = lazy(() => import("./features/functionality/pages/funds-crud.page"));
const BudgetsCrud = lazy(()  => import("./features/functionality/pages/budgets-crud.page"));
const Link = lazy(()  => import("./features/functionality/pages/link.page"));
const ProjectsLinkPage = lazy(()  => import("./features/functionality/pages/projects-link.page"));
const FunctionalAreaCrudPage = lazy(()  => import("./features/functionality/pages/functional-area-crud.page"));
const PosPreSapienciaForm = lazy(()  => import("./features/functionality/pages/pospre-sapiencia-crud.page"));
const BudgetsView = lazy(()  => import("./features/functionality/pages/budgets-view.page"));

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
              <Route path={"/gestion-financiera/funcionalidad"} element={<Functionality/>} />
              <Route path={"/gestion-financiera/funcionalidad/:option"} element={<Functionality/>} />

              <Route path={"/gestion-financiera/funcionalidad/fondos/create"} element={<FundsCrud action="new"/>} />
              <Route path={"/gestion-financiera/funcionalidad/fondos/edit/:id"} element={<FundsCrud action="edit"/>} />
            
              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/create"} element={<BudgetsCrud action="new"/>} />
              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/edit/:id"} element={<BudgetsCrud action="edit"/>} />

              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/:pospre"} element={<Link />} />
              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/:pospre/:option"} element={<Link />} />

              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/:pospre/pospre-sapiencia/create"} element={<PosPreSapienciaForm action="new"/>} />
              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/vinculacion/:pospre/pospre-sapiencia/edit/:id"} element={<PosPreSapienciaForm action="edit" />} />
              <Route path={"/gestion-financiera/funcionalidad/posicion-presupuestal/view/:id"} element={<BudgetsView/>} />

              <Route path={"/gestion-financiera/funcionalidad/area-funcional/create"} element={<FunctionalAreaCrudPage action="new"/>} />
              <Route path={"/gestion-financiera/funcionalidad/area-funcional/edit/:id"} element={<FunctionalAreaCrudPage action="edit"/>} />
              <Route path={"/gestion-financiera/funcionalidad/area-funcional/view/:id"} element={<FunctionalAreaCrudPage action="view"/>} />
              <Route path={"/gestion-financiera/funcionalidad/area-funcional/link/:id"} element={<ProjectsLinkPage action="new"/>} />
              <Route path={"/gestion-financiera/funcionalidad/area-funcional/edit/:id/link/"} element={<ProjectsLinkPage action="edit"/>} />
              
              <Route path={"/gestion-financiera/centro-gestor/"} element={<FunctionalityCenterManagerPage/>} />
              <Route path={"/gestion-financiera/centro-gestor/:option"} element={<FunctionalityCenterManagerPage/>} />
            
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default App;
