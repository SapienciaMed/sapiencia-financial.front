import React, { useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import { useParams } from "react-router-dom";
import CreateSourceFound  from "../forms/create-source-fund"

        

function TabAddFundsPage() {

    const { option } = useParams();
    const [checked, setChecked] = useState(false);
    
    const tabs: ITabsMenuTemplate[] = [
        { id: "origen", title: "Origen", content: ( <CreateSourceFound/> ), action: () => {} },
        { id: "destino", title: "Destino", content: ( <div> <h1>destino</h1> </div> ), action: () => {} },
    ]
    
    const start = tabs.find( (tab) => tab.id.toString().toLowerCase() === option?.toLowerCase() );
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>( start ? start : null );

    const tabList = {};
    tabs.forEach( (tab) => (tabList[`${tab.title}`] = {
            content: tab.content,
            action: tab.action,
        })
    );

    const handleTabClick = (tab: ITabsMenuTemplate) => {
        if (!checked) return
        setSelectedTab(tab);
    };

    useEffect(() => {
        if (!selectedTab && tabs.length > 0) setSelectedTab(tabs[0]);
    }, [tabs]);
    
    return (
        <div>
            <div className="tabs-component">
                <div className="tabs-selection">
                    {tabs.map((tab) => {
                        let active = "";
                        if (selectedTab && selectedTab.id === tab.id) active = "active";
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

export default React.memo(TabAddFundsPage);