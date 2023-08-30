import { useForm } from "react-hook-form";
import { vinculationValidator } from "../../../common/schemas";
import DetailsComponent from "../../../common/components/details.component";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useEffect, useRef, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";
import { IActivityMGA } from "../interfaces/VinculationMGAInterfaces";
import { SwitchComponent } from "../../../common/components/Form";
import {useVinculationService} from "../hooks/vinculation-mga-service.hook"
import { EResponseCodes } from "../../../common/constants/api.enum";
interface IVinculationMGAFilters {
    inputCodigoMGA: string
}

export function useVinculationMGAData(pospre: string) {
    const navigate = useNavigate();
    const [lastMove,setLastMove] = useState([]);
    const tableComponentRef = useRef(null);
    const {CreateVinculation,DeleteVinculation} = useVinculationService();
    const resolver = useYupValidationResolver(vinculationValidator);
    const { setMessage } = useContext(AppContext);
    const [activitiesLink, setActivitiesLink] = useState<number[]>([]);
    const [activitiesUnLink, setActivitiesUnLink] = useState<number[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        watch
    } = useForm<IVinculationMGAFilters>({ resolver });

    const inputValue =  watch(['inputCodigoMGA'])

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
            header: "Costo total"
        },
        {   
            fieldName: "id",
            header: "Vincular",
            renderCell:(row) => {
                return <SwitchComponent idInput={`checkRow${row.id}`} value={row.vinculation != null} onChange={(e) => {
                    if(e.value === true) {
                        setLastMove([...lastMove,{id:row}])
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
                        const auxLast = lastMove;
                        if (auxLast.findIndex((value)=>{
                            value.id == row.id;}))
                        {
                            auxLast.splice(auxLast.findIndex((value)=>{
                                value.id == row.id;
                            }),1)
                            setLastMove(auxLast);
                        }
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

    const tableColumnsEdit: ITableElement<IActivityMGA>[] = [
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

    const onNew = () => {
        navigate("./../../../");
    };

    async function vinculateActivities(message?:boolean):Promise<void> {

        let status = true;
        if(activitiesUnLink){
            const res = await DeleteVinculation(Number(pospre),activitiesUnLink);
            if(res.operation.code != EResponseCodes.OK){
                    message && setMessage({
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
            }
        }
        if(status && activitiesLink){
            const res = await CreateVinculation(Number(pospre), activitiesLink);
            if(res.operation.code != EResponseCodes.OK){
                message && setMessage({
                    title: "Hubo un problema...",
                    description: res.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                });
            } 
        }
        if (lastMove.length <= 0) {
            
            message && setMessage({
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
        } else {
            message && setMessage({
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

    const onSubmit = handleSubmit(async (data: IVinculationMGAFilters) => {
        setShowTable(true)
        loadTableData({ budgetId: data.inputCodigoMGA, mgaId: pospre  });
    });

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    return { register, reset, errors, tableComponentRef, tableColumns, showTable, control, onSubmit, isBtnDisable,
        tableActions,tableColumnsEdit, setShowTable, vinculateActivities,loadTableData }
} 