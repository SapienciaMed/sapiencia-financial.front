import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";
import "./styles/_app.scss";
import "./styles/_theme-prime.css";
import "primereact/resources/primereact.min.css";
import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";

const Home = lazy(() => import("./features/home/pages/home.page"));
const Functionality = lazy(() => import("./features/funcionalidad/pages/functionality.page"));
const FundsCrud = lazy(() => import("./features/funcionalidad/pages/funds-crud.page"));
const BudgetsCrud = lazy(()  => import("./features/funcionalidad/pages/budgets-crud.page"));

function App() {
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
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default App;
