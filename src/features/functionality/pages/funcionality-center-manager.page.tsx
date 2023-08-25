import { useParams, useNavigate } from 'react-router-dom';
import TabListComponent from '../../../common/components/tab-list.component';
import { ITabsMenuTemplate } from '../../../common/interfaces/tabs-menu.interface';
import ManagementCenterPage from './management-center.page';
import React from 'react';
import ManagementCenterAdditionalPage from './management-center-additional.page';

interface IAppProps { }

//TODO: ELIMINAR
function FunctionalityCenterManagerPage(props: IAppProps): React.JSX.Element {
    const { option } = useParams();
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { id: "adicion", title: "Adición",  content: <ManagementCenterAdditionalPage />, action: () => { navigate("/gestion-financiera/centro-gestor/adicion") } },
        { id: "traslado", title: "Traslado", content: <ManagementCenterPage/>, action: () => { navigate("/gestion-financiera/centro-gestor/traslado") } },
        { id: "disminucion", title: "Disminución", content: <> Disminución </> , action: () => { navigate("") } },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Centro Gestor</div>
                </div>
                <TabListComponent tabs={tabs} start={start}/>
            </div>
        </div>
    )
}

export default React.memo(FunctionalityCenterManagerPage);