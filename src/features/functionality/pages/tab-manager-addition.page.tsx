import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ITabsMenuTemplate } from '../../../common/interfaces/tabs-menu.interface';
import TabListComponent from '../../../common/components/tab-list.component';
import AreaCreateAddition from '../../forms/area-create-addition';
import AreaCreateExpense from '../../forms/area-create-expense';
import { FieldErrors, Control } from 'react-hook-form';
import { IAdditionsIncome } from '../interfaces/Additions';
import { IMessage } from '../../../common/interfaces/global.interface';
import { TabCreateAddition } from '../../../common/components/tab-create-addition';

interface IAppProps {
    controlRegister: Control<IAdditionsIncome, any>,
    errors: FieldErrors<IAdditionsIncome>
    showModal: (values: IMessage) => void,
    isNextTab: boolean,
    onSubmitTab: (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>
}

function TabManagerAdditionPage({controlRegister, errors, showModal, isNextTab, onSubmitTab}: IAppProps) {
    const { option } = useParams();
    const navigate = useNavigate();

    const tabs: ITabsMenuTemplate[] = [
        { 
            id: "ingreso", 
            title: "Ingreso",  
            content: <AreaCreateAddition titleAdd='ingreso' controlRegister={controlRegister} errors={errors} showModal={showModal}/>, 
            action: () => {  } 
        },
        { 
            id: "gasto", 
            title: "Gasto", 
            content: <AreaCreateExpense titleAdd='gasto' control={controlRegister}/>, 
            action: () => {  } 
        },
    ];

    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>(start ? start : null);
    
    const tabList = {};
    tabs.forEach((tab) => tabList[`${tab.title}`] = {
        content: tab.content,
        action: tab.action
    });
    
    const handleTabClick = (tab: ITabsMenuTemplate) => {
        onSubmitTab()
        if (isNextTab) {        
            setSelectedTab(tab);
        }
    };

    useEffect(() => {
        if(!selectedTab) if(tabs.length !== 0) {
            setSelectedTab(tabs[0]);
        }
    }, [tabs])
    
    useEffect(() => {
        if(selectedTab) if(selectedTab.action) selectedTab.action();
    }, [selectedTab])

    return (
        <div className='pt-24px'>
            <div className='tabs-component'>
                <div className="tabs-selection">
                    {tabs.map((tab) => {
                        let active = "";
                        if(selectedTab) if(selectedTab.id === tab.id) active = "active";
                        return (
                            <div className={`tab-option ${active}`} key={tab.id} onClick={() => { handleTabClick(tab) }}>
                                {tab.title}
                            </div>
                        )
                    })}
                </div>
                <div className="tabs-content">
                    {selectedTab ?tabList[`${selectedTab?.title}`].content : "no data"}
                </div>
            </div>
        </div>
  )
}

export default React.memo(TabManagerAdditionPage);