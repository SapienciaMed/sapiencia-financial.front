import { useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../interfaces/tabs-menu.interface";

interface IAppProps {
    tabs: ITabsMenuTemplate[];
    start?: ITabsMenuTemplate;
    index?: number;
    className?: string;
}

function TabListComponent({ tabs, className, start, index }: IAppProps): React.JSX.Element {
    const tabList = {};
    tabs.forEach((tab) => tabList[`${tab.title}`] = {
        content: tab.content,
        action: tab.action
    });
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>(start ? start : null);
    
    useEffect(() => {
        if(!selectedTab) if(tabs.length !== 0) {
            setSelectedTab(tabs[0]);
        }
    }, [tabs])
    
    useEffect(() => {
        if(index){
            setSelectedTab(tabs[index]);
        }
    }, [index])

    useEffect(() => {
        if(selectedTab) if(selectedTab.action) selectedTab.action();
    }, [selectedTab])

    return (
        <div className={`tabs-component ${className ? className : ""}`}>
            <div className="tabs-selection">
                {tabs.map((tab) => {
                    let active = "";
                    if(selectedTab) if(selectedTab.id === tab.id) active = "active";
                    return (
                        <div className={`tab-option ${active}`} key={tab.id} onClick={() => {
                                if(isNaN(parseInt(`${index}`))) setSelectedTab(tab);
                            }}>
                            {tab.title}
                        </div>
                    )
                })}
            </div>
            <div className="tabs-content">
                {selectedTab ?tabList[`${selectedTab?.title}`].content : "no data"}
            </div>
        </div>
    )
}

export default TabListComponent;