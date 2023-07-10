import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import DetailsComponent from "../../../common/components/details.component";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IBudgets, IFilterBudgets } from "../interfaces/Budgets";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useEntitiesService } from "./entities-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";

export function useFoundData() {
    const tableComponentRef = useRef(null);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const { GetEntities } = useEntitiesService();
    const resolver = useYupValidationResolver(fundsValidator);
    const [entitySelected, setEntitySelected] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setValueRegister,
    reset
  } = useForm<IFilterBudgets>({ resolver });
    const tableColumns: ITableElement<IBudgets>[] = [
        {
            fieldName: "entity.name",
            header: "Entidad CP",
        },
        {
            fieldName: "ejercise",
            header: "Ejercicio"
        },
        {
            fieldName: "number",
            header: "Posición presupuestaria"
        },
        {
            fieldName: "denomination",
            header: "Denominacion"
        },
    ];
    const tableActions: ITableAction<IBudgets>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Entidad CP",
                        value: `${row.entity.name}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.ejercise}`
                    },
                    {
                        title: "Posición presupuestaria",
                        value: `${row.number}`
                    },
                    {
                        title: "Denominación",
                        value: `${row.denomination}`
                    }
                ]
                setMessage({
                    title: "Detalles",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        },
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

    const onSubmit = handleSubmit(async (data: IFilterBudgets) => {
        loadTableData(data);
    });

    useEffect(() => {
        loadTableData();
        GetEntities().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.name, value: entity.id };
                });
                setEntitiesData(arrayEntities);
            }
        }).catch(() => { });
    }, [])
    
    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        onSubmit,
        register,
        navigate,
        errors,
        setValueRegister,
        reset,
        entitySelected,
        setEntitySelected,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        entitiesData
    }
} 