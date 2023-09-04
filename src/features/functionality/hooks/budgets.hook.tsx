import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IBudgets } from "../interfaces/Budgets";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useEntitiesService } from "./entities-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";

interface IFilterBudgets {
    number: string
}

export function useBudgetsData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetEntities } = useEntitiesService();
    const resolver = useYupValidationResolver(fundsValidator);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
    const [isVisibleTable, setIsVisibleTable] = useState<Boolean>(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    
    const {
    handleSubmit,
    register,
    formState: { errors },
    control: controlRegister,
    reset,
    watch
  } = useForm<IFilterBudgets>({ resolver });

    const inputValue =  watch(['number'])

    const tableColumns: ITableElement<IBudgets>[] = [
        {
            fieldName: "number",
            header: "Posición presupuestaria"
        },
        {
            fieldName: "denomination",
            header: "Denominacion"
        },
        {
            fieldName: "",
            header: "Vinculación MGA",
        },
        {
            fieldName: "",
            header: "Pospre Sapiencia"
        },
        
        
    ];
    const tableActions: ITableAction<IBudgets>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                navigate(`./view/${row.id}`);
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        },
        {
            icon: "Link",
            onClick: (row) => {
                navigate(`./vinculacion/${row.id}`);
            }
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IFilterBudgets) => {
        setIsVisibleTable(true);
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

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    
    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        isBtnDisable,
        isVisibleTable,
        onSubmit,
        register,
        navigate,
        errors,
        reset,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        entitiesData,
        controlRegister,
        setIsVisibleTable
    }
} 