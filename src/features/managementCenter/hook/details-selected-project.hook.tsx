import { useContext, useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import DetailProjectTabComponent from "../../../common/components/detail-project-tab.component";
import { AppContext } from "../../../common/contexts/app.context";

export function useDetailsSelectedProject(option: string, id: string ) {
    
    const { detailTransferData } = useContext(AppContext);

    const getFoundProject = (type: string) => {
        const foundProject = detailTransferData.array[0].transferMovesGroups?.find((value) => value.id == id && value.data?.some(data => data.type == type))
        return foundProject?.data.filter(u => u.type == type)
    }
    
    const originValue = getFoundProject('Origen')
    const destinationValue  = getFoundProject('Destino')

    const total = originValue.reduce((accumulatedSum, item) => {
        return accumulatedSum + item.value
    }, 0);

    const rowsOrigin = originValue?.map((item, index) => ({
        id: index + 1,
        project: [
            { title: "Centro gestor", value: item.managerCenter },
            { title: "Proyecto", value: String(item.projectId) },
            { title: "Área funcional", value: item.functionalArea },
            { title: "Fondo", value: String(item.fundId) },
            { title: "PosPre", value: String(item.budgetPosition) },
            { title: "Valor contra crédito", value: `$ ${item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` }
        ]
    }));

    const rowsDestination = destinationValue?.map((item, index) => ({
        id: index + 1,
        project: [
            { title: "Centro gestor", value: item.managerCenter },
            { title: "Proyecto", value: String(item.projectId) },
            { title: "Área funcional", value: item.functionalArea },
            { title: "Fondo", value: String(item.fundId) },
            { title: "PosPre", value: String(item.budgetPosition) },
            { title: "Valor crédito", value: `$ ${item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` }
        ]
    }))

    const tabs: ITabsMenuTemplate[] = [
        { 
            id: "origen", title: "Origen", content: <DetailProjectTabComponent rows={ rowsOrigin }/>
        },
        { 
            id: "destino", title: "Destino", content: <DetailProjectTabComponent rows={ rowsDestination }/>
        },
    ]

    const start = tabs.find( (tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>( start ?? null );

    const tabList = {};
    tabs.forEach( (tab) => (tabList[`${tab.title}`] = {
            content: tab.content,
            action: tab.action,
        })
    );

    const handleTabClick = (tab: ITabsMenuTemplate) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        if (!selectedTab && tabs.length > 0) setSelectedTab(tabs[0]);
    }, [tabs]);

    return{
        tabs,
        selectedTab,
        tabList,
        total,
        handleTabClick
    }
}