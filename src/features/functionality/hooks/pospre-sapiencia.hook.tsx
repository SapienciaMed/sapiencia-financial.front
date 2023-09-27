import { useForm } from "react-hook-form";
import { pospreSapienciaValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useEffect, useRef, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";
import { IPosPreSapiencia, IPospreSapienciaData } from "../interfaces/PosPreSapiencia";

interface IPospreSapienciaFilters {
    inputPospreSapiencia: string
}

export function usePospreSapienciaData({budgetsId, validateAction, budgetsData }: IPospreSapienciaData) {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(pospreSapienciaValidator);
    const [showTable, setShowTable] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        watch,
    } = useForm<IPospreSapienciaFilters>({ 
        resolver,
    });

    const inputValue =  watch(['inputPospreSapiencia'])

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "budget.number",
            header: "Codigo pospre",
        },
        {
            fieldName: "number",
            header: "Código sapiensa"
        },
        {
            fieldName: "ejercise",
            header: "Ejercicio"
        },
        {
            fieldName: "description",
            header: "Descripción"
        },
    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        }
    ];

    const tableColumnsView: ITableElement<IPosPreSapiencia>[] = [
        {
            fieldName: "budget.number",
            header: "Codigo pospre",
        },
        {
            fieldName: "number",
            header: "Código sapiensa"
        },
        {
            fieldName: "ejercise",
            header: "Ejercicio"
        },
        {
            fieldName: "description",
            header: "Descripción"
        },
    ];

    const tableActionsView: ITableAction<IPosPreSapiencia>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
               
            },
        }
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmitSearch = handleSubmit(async (data: IPospreSapienciaFilters) => {
        if(budgetsId){
            setShowTable(true)
            loadTableData({budgetId: budgetsId, number: data.inputPospreSapiencia});
        } 
    });
    
    useEffect(() => {
        if(budgetsId && validateAction == 'new') loadTableData({budgetId: budgetsId});
    }, [budgetsId]);

    useEffect(() => {
        if (validateAction == 'view') loadTableData({ budgetNumberSapi: budgetsData  })
    },[validateAction])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])


    return { register, reset, showTable, control, errors, tableComponentRef, tableColumns, tableActions, isBtnDisable, 
        tableColumnsView, tableActionsView, setShowTable, onSubmitSearch }
} 