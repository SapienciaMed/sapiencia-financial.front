import { Route, Routes } from 'react-router-dom'
import CreditorCrudPage from './pages/creditor-crud.page'
import CreditorViewPage from './pages/creditor-view.page';


export const CreditorRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<CreditorViewPage/>} />
            <Route path={'/crear'} element={<CreditorCrudPage/>} />
            <Route path={'/editar/:id'} element={<CreditorCrudPage/>} />
        </Routes>
  )
}
