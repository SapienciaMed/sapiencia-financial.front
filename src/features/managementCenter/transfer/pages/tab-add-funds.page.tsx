import React, { useContext, useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import { useParams } from "react-router-dom";
import CreateFundsSource from "../forms/create-funds-source";
import CreateFundsDestination from "../forms/create-fund-destination"
import {  IAddFunds } from "../interfaces/TransferAreaCrudInterface";
import { FaRegCopy } from "react-icons/fa";
import { PasteDataFinanceArea } from "../../../../common/utils/paste-data-finance-area";
import { AppContext } from "../../../../common/contexts/app.context";

function TabAddFundsPage({ control, register, arrayDataSelect, setValue, getValues }: IAddFunds) {

    const { setMessage } = useContext(AppContext);
    const [dataPaste, setDataPaste] = useState([]);
    const { option } = useParams();
       
    const tabs: ITabsMenuTemplate[] = [
        { 
            id: "origen", title: "Origen", content: ( 
                <CreateFundsSource 
                    control={control} 
                    titleAdd='origen' 
                    register={register} 
                    arrayDataSelect={arrayDataSelect} 
                    setValue={setValue} 
                    getValues={getValues}
                    dataPaste={dataPaste}
                    setDataPaste={setDataPaste}
                /> 
            )
        },
        { 
            id: "destino", title: "Destino", content: (
                <CreateFundsDestination 
                    control={control} 
                    titleAdd='destino' 
                    register={register} 
                    arrayDataSelect={arrayDataSelect} 
                    setValue={setValue} 
                    getValues={getValues}
                    dataPaste={dataPaste}
                    setDataPaste={setDataPaste}
                />
            ) 
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

    const handleTabClick = (tab: ITabsMenuTemplate) => setSelectedTab(tab);

    
    useEffect(() => {
        if (!selectedTab && tabs.length > 0) setSelectedTab(tabs[0]);
    }, [tabs]);

    const onPaste = async () =>  PasteDataFinanceArea({ arrayDataSelect, setDataPaste, setMessage })

    return (
        <div>
            <div className="tabs-component">
                <div className="tabs-selection">
                    {
                        tabs.map((tab) => {
                            let active = "";
                            if (selectedTab && selectedTab.id === tab.id) active = "active";
                            return (
                                <div
                                    className={`tab-option ${active} `}
                                    key={tab.id}
                                    onClick={() => {
                                        handleTabClick(tab);
                                    }}
                                >
                                    {tab.title}
                                </div>

                            );
                        })
                    }
                    <div className="title-button text-three large" id='pages' onClick={onPaste}> Pegar <FaRegCopy /> </div>
                </div>
                <div className="tabs-content">
                    {selectedTab ? tabList[`${selectedTab?.title}`].content : "no data"}
                </div>
            </div>
        </div>
    )
}

export default React.memo(TabAddFundsPage);