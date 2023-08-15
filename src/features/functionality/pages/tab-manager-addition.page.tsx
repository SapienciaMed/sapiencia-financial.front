import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ITabsMenuTemplate } from '../../../common/interfaces/tabs-menu.interface';
import TabListComponent from '../../../common/components/tab-list.component';
import AreaCreateAddition from '../../forms/area-create-addition';
import AreaCreateExpense from '../../forms/area-create-expense';

interface IAppProps {
    control: any
}

function TabManagerAdditionPage({control}: IAppProps) {
    const { option } = useParams();
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { 
            id: "ingreso", 
            title: "Ingreso",  
            content: <AreaCreateAddition titleAdd='ingreso' control={control}/>, 
            action: () => { navigate("") } 
        },
        { 
            id: "gasto", 
            title: "Gasto", 
            content: <AreaCreateExpense titleAdd='gasto' control={control}/>, 
            action: () => { navigate("") } 
        },
    ];
    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());

    return (
        <div className='pt-24px'>
            <TabListComponent tabs={tabs} start={start}/>
        </div>
  )
}

export default React.memo(TabManagerAdditionPage);