import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { vinculationValidator } from "../../../common/schemas";
import DetailsComponent from "../../../common/components/details.component";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useEffect, useRef, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";
import { InputSwitch } from 'primereact/inputswitch';
import { IActivityMGA } from "../interfaces/VinculationMGAInterfaces";
import { SwitchComponent } from "../../../common/components/Form";
import { number } from "yup";
import {useVinculationService} from "../hooks/vinculation-mga-service.hook"
import { EResponseCodes } from "../../../common/constants/api.enum";
interface IVinculationMGAFilters {
    number: string
}

export function useVinculationMGAData(pospre: string) {
    const navigate = useNavigate();
    const tableComponentRef = useRef(null);
    const {CreateVinculation,DeleteVinculation} = useVinculationService();
    const resolver = useYupValidationResolver(vinculationValidator);
    const { setMessage } = useContext(AppContext);
    const [activitiesLink, setActivitiesLink] = useState<number[]>([]);
    const [activitiesUnLink, setActivitiesUnLink] = useState<number[]>([]);
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        reset,
    } = useForm<IVinculationMGAFilters>({ resolver });
    const tableColumns: ITableElement<IActivityMGA>[] = [
        {
            fieldName: "id",
            header: "Codigo",
        },
        {
            fieldName: "unit",
            header: "Unidad de medida"
        },
        {
            fieldName: "quantity",
            header: "Cantidad"
        },
        {
            fieldName: "cost",
            header: "Costo"
        },
        {   
            fieldName: "id",
            header: "Vincular",
            renderCell:(row) => {
                return <SwitchComponent idInput={`checkRow${row.id}`} value={row.vinculation ? true : false } onChange={(e) => {
                    if(e.value === true) {
                        const activityLink = activitiesLink.find(activity => activity == row.id)
                        if(!activityLink){
                           const array = activitiesLink;
                           array.push(row.id)
                           setActivitiesLink(array);
                        }
                        const activityUnLink = activitiesUnLink.find(activity => activity == row.id)
                        if(activityUnLink){
                           const array = activitiesUnLink.filter(item => item != row.id);
                           setActivitiesUnLink(array);
                        }
                    } else {
                        const activityUnLink = activitiesUnLink.find(activity => activity == row.id)
                        if(!activityUnLink){
                            const array = activitiesUnLink;
                            array.push(row.id)
                            setActivitiesUnLink(array);
                        }
                        const activityLink = activitiesLink.find(activity => activity == row.id)
                        if(activityLink){
                            const array = activitiesLink.filter(item => item != row.id);
                            setActivitiesLink(array);
                        }
                    }
                }} /> 
            }
        },
    ];
   

    const tableActions: ITableAction<IActivityMGA>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Código",
                        value: `${row.id}`
                    },
                    {
                        title: "Unidad de medida",
                        value: `${row.unit}`
                    },
                    {
                        title: "Cantidad",
                        value: `${row.quantity}`
                    },
                    {
                        title: "Costo",
                        value: `${row.cost}`
                    },
                    {
                        title: "Producto MGA",
                        value: `${row.description}`
                    },
                    {
                        title: "Actividad MGA",
                        value: `${row.description}`
                    },
                    {
                        title: "Actividades detalladas",
                        value: `${row.description}`
                    }
                ]
                setMessage({
                    title: "Detalle Vinculación MGA ",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    useEffect(() => {
        if(Number(pospre)) loadTableData({budgetId: Number(pospre)});
    }, [pospre])

    async function vinculateActivities() {
        const res = await actionsVinculated();
        if(res){
            console.log("OK")
        }else {
            console.log("chulo")
        }
        console.log(activitiesLink,activitiesUnLink);
    };

    const onNew = () => {
        navigate("./../../../");
    };

    async function actionsVinculated():Promise<boolean> {

        let status = true;
        if(activitiesUnLink){
            const res = await DeleteVinculation(Number(pospre),activitiesUnLink);
            if(res.operation.code != EResponseCodes.OK){

                setMessage({
                    title: "Hubo un problema...",
                    description: res.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
                status = false;
            }else {
                setMessage({
                    title: "Vinculación MGA",
                    description: "Se ha Eliminado la vinculación MGA exitosamente",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        onNew();
                        setMessage({});
                    },
                    background: true
                });
            }
        }
        if(status && activitiesLink){
            const res = await CreateVinculation(Number(pospre), activitiesLink);
            if(res.operation.code != EResponseCodes.OK){
                status = false;
                setMessage({
                    title: "Hubo un problema...",
                    description: res.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
            } else {
                setMessage({
                    title: "Vinculación MGA",
                    description: "Se ha creado la vinculación MGA exitosamente",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        onNew();
                        setMessage({});
                    },
                    background: true
                });
            }
        }
        return status;
    }

    return { register, reset, errors, tableComponentRef, tableColumns, tableActions, vinculateActivities }
} 