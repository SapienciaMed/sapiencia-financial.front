
import React from 'react'
import { useDetailsSelectedProject } from '../hook/details-selected-project.hook';
import { ButtonComponent } from '../../../common/components/Form';

interface ISelectedProject {
    option: string,
    onOk: () => void,
    id: string,
    total: string,
}

function DetailsSelectedProjectComponent({ option, id, onOk, total}: ISelectedProject): React.JSX.Element {

    const { tabs, selectedTab, tabList, handleTabClick } = useDetailsSelectedProject(option, id)

    return (
        <div className="tabs-component full-width">
            <div className="tabs-selection">
                {
                    tabs?.map((tab) => {
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
                    })
                }
            </div>
            <div className="tabs-content" style={{maxHeight: '30vh', overflow: 'auto', margin: '0.5rem 0'}}>
                {selectedTab ? tabList[`${selectedTab?.title}`].content : "no data"}
            </div>
            <footer className='container-button-descripcion-modal'>
                <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{color: '#533893'}}> $ {total} </label>
                </div>
                <div className="buttons-bot">
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Aceptar"
                        action={() => onOk()}
                    />
                </div>
            </footer>
        </div>
    )
}

export default DetailsSelectedProjectComponent;
