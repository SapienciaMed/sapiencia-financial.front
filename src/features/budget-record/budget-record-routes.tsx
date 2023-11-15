import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import BudgetRecordCrudPagev2 from './page/budget-record-crudv2.page'
import BudgetRecordViewPage from './page/budget-record-view.page'
import BudgetRecordEditRpPage from './page/budget-record-edit.page'


export const BudgetRecordRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<BudgetRecordViewPage/>} />
            <Route path={'/crear'} element={<BudgetRecordCrudPagev2/>} />
            <Route path={'/editar-rp/:id'} element={<BudgetRecordEditRpPage/>} />
        </Routes>
  )
}
