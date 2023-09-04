import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";


export const FunctionalityRoutes = () => {
    
    const FoundsPage =  lazy(() => import("./pages/funds.page"));
    const FundsCrud = lazy(() => import("./pages/funds-crud.page"));
    
    const BudgetsPage = lazy(() => import("./pages/budgets.page"))
    const BudgetsCrud = lazy(()  => import("./pages/budgets-crud.page"));
    
    const Link = lazy(()  => import("./pages/link.page"));
    const ProjectsLinkPage = lazy(()  => import("./pages/projects-link.page"));
    const FunctionalAreaCrudPage = lazy(()  => import("./pages/functional-area-crud.page"));
    const FunctionalAreaPage = lazy(() => import ("./pages/functional-area.page"));

    const PosPreSapienciaForm = lazy(()  => import("./pages/pospre-sapiencia-crud.page"));
    const BudgetsView = lazy(()  => import("./pages/budgets-view.page"));

  return (
    <Routes>
        <Route path={"/fondos"} element={<FoundsPage/>} />
        <Route path={"/fondos/create"} element={<FundsCrud action="new"/>} />
        <Route path={"/fondos/edit/:id"} element={<FundsCrud action="edit"/>} />
       

        <Route path={"/posicion-presupuestaria/"} element={<BudgetsPage/>} />
        <Route path={"/posicion-presupuestaria/create"} element={<BudgetsCrud action="new"/>} />
        <Route path={"/posicion-presupuestaria/edit/:id"} element={<BudgetsCrud action="edit"/>} />

        <Route path={"/posicion-presupuestaria/vinculacion/:pospre"} element={<Link />} />
        <Route path={"/posicion-presupuestaria/vinculacion/:pospre/:option"} element={<Link />} />

        <Route path={"/posicion-presupuestaria/vinculacion/:pospre/pospre-sapiencia/create"} element={<PosPreSapienciaForm action="new"/>} />
        <Route path={"/posicion-presupuestaria/vinculacion/:pospre/pospre-sapiencia/edit/:id"} element={<PosPreSapienciaForm action="edit" />} />
        <Route path={"/posicion-presupuestaria/view/:id"} element={<BudgetsView/>} />

        <Route path={"/area-funcional/"} element={<FunctionalAreaPage/>} />
        <Route path={"/area-funcional/create"} element={<FunctionalAreaCrudPage action="new"/>} />
        <Route path={"/area-funcional/edit/:id"} element={<FunctionalAreaCrudPage action="edit"/>} />
        <Route path={"/area-funcional/view/:id"} element={<FunctionalAreaCrudPage action="view"/>} />
        <Route path={"/area-funcional/link/:id"} element={<ProjectsLinkPage action="new"/>} />
        <Route path={"/area-funcional/edit/:id/link/"} element={<ProjectsLinkPage action="edit"/>} />

    </Routes>
  )
}
