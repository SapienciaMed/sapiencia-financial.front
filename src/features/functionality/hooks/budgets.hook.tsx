import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IBudgets } from "../interfaces/Budgets";

interface IFilterBudgets {
    number: string
}

export function useBudgetsData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsValidator);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
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
            header: "Denominación"
        },
        {
            fieldName: "",
            header: "Vinculación MGA",
            renderCell: (row) => {
                return (<>-</>)
            }

        },
        {
            fieldName: "",
            header: "Pospre Sapiencia",
            renderCell: (row) => {
                return (<>{row.pospresap.length > 0 ? row.pospresap.length : '-'}</>)
            }
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
        controlRegister,
        setIsVisibleTable
    }
} 