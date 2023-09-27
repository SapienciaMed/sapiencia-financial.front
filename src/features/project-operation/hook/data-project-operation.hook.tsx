import { useContext, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
/* import { IFundsFilters, IFunds } from "../../interfaces/Funds"; */
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import DetailsComponent from "../../../common/components/details.component";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
/* import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities"; */
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { IProjectOperation } from "../interface/ProjectOperation";

export function useDataProjectOperation() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsValidator);
    const { setMessage } = useContext(AppContext);
    /* const { GetEntities } = useEntitiesService(); */
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
    const [isVisibleTable, setIsVisibleTable] = useState<Boolean>(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        reset,
        watch,
        control: controlRegister
    } = useForm<any>({ resolver, mode:'all' });
    //} = useForm<IFundsFilters>({ resolver, mode:'all' });
    
    const inputValue =  watch(['entity','number', 'dateFrom', 'dateTo'])


    const tableColumns: ITableElement<IProjectOperation>[] = [
        {
            fieldName: "entityId",
            header: "Entidad CP",
        },
        {
            fieldName: "number",
            header: "Proyecto"
        },
        {
            fieldName: "name",
            header: "Denominación"
        },
        {
            fieldName: "exercise",
            header: "Vigencia"
        },
        {
            fieldName: "isActivated",
            header: "Estado"
        },
        {
            fieldName: "dateFrom",
            header: "Validez desde",
            renderCell: (row) => {
                return <>{DateTime.fromISO(row.dateFrom).toLocaleString()}</>;
            }
        },
        {
            fieldName: "dateTo",
            header: "Validez hasta",
            renderCell: (row) => {
                return <>{DateTime.fromISO(row.dateTo).toLocaleString()}</>;
            }
        },
    ];

    async function validatorNumber(e) {
        if (parseInt(e.target.value) < 0) {
        return (e.target.value = "");
        }
    }
    
    const tableActions: ITableAction<IProjectOperation>[] = [
        /* {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Entidad CP",
                        value: `${row.entityId}`
                    },
                    {
                        title: "Proyecto",
                        value: `${row.number}`
                    },
                    {
                        title: "Denominación",
                        value: `${row.name}`
                    },
                    {
                        title: "Vigencia",
                        value: `${row.exercise}`
                    },
                    {
                        title: "Estado",
                        value: `${row.isActivated}`
                    },
                    {
                        title: "Validez a",
                        value: `${DateTime.fromISO(row.dateTo).toLocaleString()}`
                    },
                    {
                        title: "Validez a",
                        value: `${DateTime.fromISO(row.dateTo).toLocaleString()}`
                    }
                ]
                setMessage({
                    title: "Detalle de Fondos",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        }, */
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: any) => {
        loadTableData(data);
        setIsVisibleTable(true);
    });

    useEffect(() => {
        loadTableData();
        /* GetEntities().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setEntitiesData(arrayEntities);
            }
        }).catch(() => { }); */
    }, [])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    return {
      tableComponentRef,
      tableColumns,
      tableActions,
      onSubmit,
      navigate,
      register,
      errors,
      reset,
      controlRegister,
      entitiesData,
      isVisibleTable,
      setIsVisibleTable,
      validatorNumber,
      isValid,
      isBtnDisable
    };
} 