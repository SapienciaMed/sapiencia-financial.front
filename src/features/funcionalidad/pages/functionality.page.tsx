import { useParams, useNavigate } from 'react-router-dom';
import TabListComponent from '../../../common/components/tab-list.component';
import { ITabsMenuTemplate } from '../../../common/interfaces/tabs-menu.interface';
import FoundsPage from './funds.page';

interface IAppProps { }

function FunctionalityPage(props: IAppProps): React.JSX.Element {
    const { option } = useParams();
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { id: "fondos", title: "Fondos", content: <FoundsPage/>, action: () => { navigate("/financial/funcionalidad/fondos") } },
        { id: "posicion-presupuestal", title: "Posición presupuestal", content: <>aqui va tu pagina c:</>, action: () => { navigate("/financial/funcionalidad/posicion-presupuestal") } },
        { id: "proyectos", title: "Proyectos", content: <>aqui va tu pagina c:</>, action: () => { navigate("/financial/funcionalidad/proyectos") } },
        { id: "area-funcional", title: "Area funcional", content: <>aqui va tu pagina c:</>, action: () => { navigate("/financial/funcionalidad/area-funcional") } },
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