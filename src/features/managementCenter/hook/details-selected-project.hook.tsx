import { useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import { mockData } from "../transfer/hook/transfer-area-crud.hook";
import DetailProjectTabComponent from "../../../common/components/detail-project-tab.component";

export function useDetailsSelectedProject(idListNameProject: string, option: string, id: string ) {

    const getFoundProject = (id, idListNameProject) => {
        const foundProject = mockData.array.find((option) => option.id == id && option.listNameProject.some(project => project.id == idListNameProject));
        return foundProject.listNameProject.filter(u => u.id == idListNameProject)[0];
    };
    
    const originValue = getFoundProject(id, idListNameProject).origen;
    const destinationValue = getFoundProject(id, idListNameProject).destino;
    
    const rowsOrigin = originValue.map((item, index) => ({
        id: index + 1,
        project: [
            { title: "Centro gestor", value: item.managerCenter },
            { title: "Proyecto", value: item.projectId },
            { title: "Área funcional", value: item.functionalArea },
            { title: "Fondo", value: item.funds },
            { title: "PosPre", value: item.posPre },
            { title: "Valor contra crédito", value: item.value }
        ]
    }));

    const rowsDestination = destinationValue.map((item, index) => ({
        id: index + 1,
        project: [
            { title: "Centro gestor", value: item.managerCenter },
            { title: "Proyecto", value: item.projectId },
            { title: "Área funcional", value: item.functionalArea },
            { title: "Fondo", value: item.funds },
            { title: "PosPre", value: item.posPre },
            { title: "Valor crédito", value: item.value }
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
        handleTabClick
    }
}