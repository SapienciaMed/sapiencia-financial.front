import { useParams, useNavigate } from 'react-router-dom';
import TabListComponent from '../../../common/components/tab-list.component';
import { ITabsMenuTemplate } from '../../../common/interfaces/tabs-menu.interface';
import FoundsPage from './funds.page';
import BudgetsPage from './budgets.page';

interface IAppProps { }

function FunctionalityPage(props: IAppProps): React.JSX.Element {
    const { option } = useParams();
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { id: "fondos", title: "Fondos", content: <FoundsPage/>, action: () => { navigate("/gestion-financiera/funcionalidad/fondos") } },
        { id: "posicion-presupuestal", title: "Posición presupuestal", content: <BudgetsPage/>, action: () => { navigate("/gestion-financiera/funcionalidad/posicion-presupuestal") } },
        { id: "proyectos", title: "Proyectos", content: <>aqui va tu pagina c:</>, action: () => { navigate("/gestion-financiera/funcionalidad/proyectos") } },
        { id: "area-funcional", title: "Area funcional", content: <>aqui va tu pagina c:</>, action: () => { navigate("/gestion-financiera/funcionalidad/area-funcional") } },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Funcionalidad</div>
                </div>
                <TabListComponent tabs={tabs} start={start}/>
            </div>
        </div>
    )
}

export default FunctionalityPage;