import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import BudgetRecordCrudPage from './page/budget-record-crud.page'


export const BudgetRecordRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<BudgetRecordCrudPage/>} />
            <Route path={'/crear'} element={<BudgetRecordCrudPage/>} />
        </Routes>
  )
}
