import { Tree } from "primereact/tree";
import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FieldsetComponent, ButtonComponent } from "../Form/index";
import { ITransferBoxTemplate } from "../../interfaces/transfer-box.interface";

interface ITransferProps<T> {
    idInput: string;
    data: ITransferBoxTemplate[];
    register: UseFormRegister<T>;
    setValueRegister: UseFormSetValue<T>;
    available?: ITransferBoxTemplate[];
    selected?: ITransferBoxTemplate[];
}

export function TransferBoxComponent({ idInput, data, register, setValueRegister, available=[], selected=[] }: ITransferProps<any>): React.JSX.Element {
    const [selectedItems, setSelectedItems] = useState<ITransferBoxTemplate[]>([]);
    const [availableItems, setAvailableItems] = useState<ITransferBoxTemplate[]>([]);
    const [stateSelected, setStateSelected] = useState({});
    const [stateAvailable, setStateAvailable] = useState({});

    useEffect(() => {
        if(available.length == 0 && selected.length == 0) setAvailableItems(data);
    }, [data]);

    useEffect(() => {
        if(available.length != 0 || selected.length != 0) {
            setAvailableItems(available);
            setSelectedItems(selected);
        }
    }, [available, selected]);

    const handleSelectItem = () => {
        const keys = Object.keys(stateSelected);
        const childrenSelectedKeys: string[] = [];
        selectedItems.forEach((item) => {
            item.children.forEach((child) => {
                childrenSelectedKeys.push(child.key)
            });
        });
        let childrenKeys = keys.filter(key => stateSelected[key].checked === true && key.toString().includes('-'));
        const parentKey: string[] = availableItems.map(availableItem => {
            if(!keys.includes(availableItem.key)) return availableItem.key;
        }).concat(keys.filter(key => stateSelected[key].partialChecked === true));
        let select = data.filter((items) => keys.includes(items.key)).map((item) => {
            return { ...item, children: item.children?.filter((children) => childrenKeys.includes(children.key)) }
        });
        const selectData = selectedItems.length === 0 ? select : selectedItems.map(obj1 => {
            const obj2 = select.find(obj => obj.key === obj1.key);
            select = select.filter(item => item != obj2);
            if (obj1) {
                if (obj2) {
                    return {
                        ...obj1,
                        children: [...obj1.children, ...obj2.children]
                    };
                }
                return obj1;
            } else {
                return obj2;
            }
        }).concat(select);
        const keysSelected = selectData.map(key => key.key);
        childrenKeys = childrenKeys.concat(childrenSelectedKeys);
        const availableData = data.filter((item) => !keysSelected.includes(item.key) || parentKey.includes(item.key)).map((item) => {
            return { ...item, children: item.children?.filter((children) => !childrenKeys.includes(children.key)) }
        });
        setSelectedItems(selectData);
        setAvailableItems(availableData);
        setStateSelected({});
        setStateAvailable({});
    };

    const handleDeselectItem = () => {
        const keys = Object.keys(stateAvailable);
        const childrenAvailableKeys: string[] = [];
        availableItems.forEach((item) => {
            item.children.forEach((child) => {
                childrenAvailableKeys.push(child.key)
            });
        });
        let childrenKeys = keys.filter(key => stateAvailable[key].checked === true && key.toString().includes('-'));
        const parentKey: string[] = selectedItems.map(selectedItem => {
            if(!keys.includes(selectedItem.key)) return selectedItem.key;
        }).concat(keys.filter(key => stateAvailable[key].partialChecked === true));
        let available = data.filter((items) => keys.includes(items.key)).map((item) => {
            return { ...item, children: item.children?.filter((children) => childrenKeys.includes(children.key)) }
        });
        const availableData = availableItems.length === 0 ? available : availableItems.map(obj1 => {
            const obj2 = available.find(obj => obj.key === obj1.key);
            available = available.filter(item => item != obj2);
            if (obj1) {
                if (obj2) {
                    return {
                        ...obj1,
                        children: [...obj1.children, ...obj2.children]
                    };
                }
                return obj1;
            } else {
                return obj2;
            }
        }).concat(available);
        const keysAvaible = availableData.map(key => key.key)
        childrenKeys = childrenKeys.concat(childrenAvailableKeys);
        const selectData = data.filter((item) => !keysAvaible.includes(item.key) || parentKey.includes(item.key)).map((item) => {
            return { ...item, children: item.children?.filter((children) => !childrenKeys.includes(children.key)) }
        });
        setSelectedItems(selectData);
        setAvailableItems(availableData);
        setStateAvailable({});
        setStateSelected({});
    };

    useEffect(() => {
        setValueRegister(idInput, { available: availableItems, selected: selectedItems })
    }, [ availableItems, selectedItems ])

    return (
        <div className="transferbox-container" {...register(idInput)}>
            <FieldsetComponent legend="Lista de opciones">
                <TreeListComponent data={availableItems} state={stateSelected} setState={setStateSelected} />
            </FieldsetComponent>
            <div className="transferbox-buttons-container">
                <ButtonComponent className="button-main large hover-three" value="Agregar" type="button" action={handleSelectItem} />
                <ButtonComponent className="button-main large hover-three" value="Quitar" type="button" action={handleDeselectItem} />
            </div>
            <FieldsetComponent legend="Opciones asignadas">
                <TreeListComponent data={selectedItems} state={stateAvailable} setState={setStateAvailable} />
            </FieldsetComponent>
        </div>
    );
}

interface ITreeProps<T> {
    data: Array<Object>;
    state: any;
    setState: any;
}

export function TreeListComponent({ data, state, setState }: ITreeProps<any>): React.JSX.Element {
    return (
        <Tree value={data} selectionMode="checkbox" selectionKeys={state} onSelectionChange={(e) => setState(e.value)} className="w-full md:w-30rem" />
    )
}