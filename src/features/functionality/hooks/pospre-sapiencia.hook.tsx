import { useForm } from "react-hook-form";
import { pospreSapienciaValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useEffect, useRef } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";

interface IPospreSapienciaFilters {
    number: string
}

export function usePospreSapienciaData(pospre: string) {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(pospreSapienciaValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm<IPospreSapienciaFilters>({ resolver });
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

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmitSearch = handleSubmit(async (data: IPospreSapienciaFilters) => {
        if(pospre) loadTableData({budgetId: pospre, number: data.number});
    });

    useEffect(() => {
        if(pospre) loadTableData({budgetId: pospre});
    }, [pospre]);

    return { register, reset, errors, tableComponentRef, tableColumns, tableActions, onSubmitSearch }
} 