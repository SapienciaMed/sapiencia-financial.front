
import React, { MutableRefObject, useEffect, useState } from 'react'
import { ITabsMenuTemplate } from '../../../../common/interfaces/tabs-menu.interface';
import { useParams } from 'react-router-dom';
import TableComponent from '../../../../common/components/table.component';
import { ITableAction, ITableElement } from '../../../../common/interfaces/table.interfaces';
import { IActivityMGA } from '../../interfaces/VinculationMGAInterfaces';

interface ITabBugetView{
    tableComponentRef: MutableRefObject<any>,
    tableColumnsEdit: ITableElement<any>[]
    tableActions: ITableAction<any>[]
}
//TODO ELIMINAR?
function TabBudgetView({ tableActions, tableColumnsEdit, tableComponentRef }: ITabBugetView) {

    const { option } = useParams();

    const tabs: ITabsMenuTemplate[] = [
        {
          id: "vinculacionMGA",
          title: "Vinculación MGA",
          content: ( 
                <div className="card-form no-box-shadow">
                    <TableComponent
                        ref={tableComponentRef}
                        url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-paginated`}
                        columns={tableColumnsEdit}
                        actions={tableActions}
                        isShowModal={false}
                    />
                </div>
            ),
          action: () => {},
        },
        {
          id: "pospreSapiencia",
          title: "Pospre sapiencia",
          content: (<>Pospre sapiencia</>),
          action: () => {},
        },
    ];

    const start = tabs.find((tab) => tab.id.toString().toLowerCase() === option?.toLowerCase());
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>( start ? start : null );

    const tabList = {};
    tabs.forEach(
        (tab) =>
        (tabList[`${tab.title}`] = {
            content: tab.content,
            action: tab.action,
        })
    );

    const handleTabClick = (tab: ITabsMenuTemplate) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        if (!selectedTab)
            if (tabs.length !== 0) {
                setSelectedTab(tabs[0]);
            }
    }, [tabs]);
    
    return (
        <div className="pt-24px">
            <div className="tabs-component">
            <div className="tabs-selection">
                {tabs.map((tab) => {
                let active = "";
                if (selectedTab) if (selectedTab.id === tab.id) active = "active";
                return (
                    <div
                    className={`tab-option ${active}`}
                    key={tab.id}
                    onClick={() => {
                        handleTabClick(tab);
                    }}
                    >
                    {tab.title}
                    </div>
                );
                })}
            </div>
            <div className="tabs-content">
                {selectedTab ? tabList[`${selectedTab?.title}`].content : "no data"}
            </div>
            </div>
        </div>
    )

}

export default React.memo(TabBudgetView);
