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

function App() {
  return (
    <AppContextProvider>
      <ModalMessageComponent />
      <ApplicationProvider>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path={"/*"} element={<Home/>} />
              <Route path={"/financial/funcionalidad"} element={<Functionality/>} />
              <Route path={"/financial/funcionalidad/:option"} element={<Functionality/>} />
              <Route path={"/financial/funcionalidad/fondos/create"} element={<>test</>} />
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default App;
