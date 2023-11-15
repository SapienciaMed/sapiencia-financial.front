import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import BudgetRecordCrudPage from './page/budget-record-crud.page'
import BudgetRecordViewPage from './page/budget-record-view.page'
import BudgetRecordEditRpPage from './page/budget-record-edit.page'
import BudgetRecordEditPage from './page/bugget-record-edit.page'


export const BudgetRecordRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<BudgetRecordViewPage/>} />
            <Route path={'/crear'} element={<BudgetRecordCrudPage/>} />
            <Route path={'/editar-rp/:id'} element={<BudgetRecordEditRpPage/>} />
            <Route path={'/edit/:id'} element={<BudgetRecordEditPage/>} />
        </Routes>
  )
}
