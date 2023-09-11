import React, { useEffect, useState } from "react";
import { ITabsMenuTemplate } from "../../../../common/interfaces/tabs-menu.interface";
import { useParams } from "react-router-dom";
import CreateFundsSource from "../forms/create-funds-source";
import CreateFundsDestination from "../forms/create-fund-destination"
import {  IAddFunds } from "../interfaces/TransferAreaCrudInterface";
import { useFormState, useWatch } from "react-hook-form";


function TabAddFundsPage({ control, register, arrayDataSelect, setValue, getValues}: IAddFunds) {

    const { option } = useParams();
    const [isDisabled, setIsDisabled] = useState(false)
    const formOrigen = useWatch({ control, name: 'origen' })
    const { isValid } = useFormState({ control})
    
    
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
                    getValues={getValues}/>
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

    const handleTabClick = (tab: ITabsMenuTemplate) => {
        isDisabled && setSelectedTab(tab);
    };

    useEffect(() => {
        if (!selectedTab && tabs.length > 0) setSelectedTab(tabs[0]);
    }, [tabs]);

    useEffect(() => {
        setIsDisabled(formOrigen?.length > 0 && validateArray(formOrigen))
    },[ isValid, formOrigen ])
   
    function validateArray(arr) {
        return arr.every(validateObject);
    }
    function validateObject(obj) {
        return Object.values(obj).every(value => value != "" && value != null);
    }
    
    return (
        <div>
            <div className="tabs-component">
                <div className="tabs-selection">
                    {tabs.map((tab) => {
                        let active = "";
                        if (selectedTab && selectedTab.id === tab.id) active = "active";
                        return (
                            <div
                                className={`tab-option ${active} ${(tab.id == 'destino' && !isDisabled) ? 'tab-option2-disabled disabled' : ''}`}
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