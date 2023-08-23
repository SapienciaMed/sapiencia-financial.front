import { useForm } from "react-hook-form";
import { pospreSapienciaValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useEffect, useRef, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";

interface IPospreSapienciaFilters {
    inputPospreSapiencia: string
}

export function usePospreSapienciaData(pospre: string) {
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

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmitSearch = handleSubmit(async (data: IPospreSapienciaFilters) => {
        if(pospre){
            setShowTable(true)
            loadTableData({budgetId: pospre, number: data.inputPospreSapiencia});
        } 
    });
    
    useEffect(() => {
        if(pospre) loadTableData({budgetId: pospre});
    }, [pospre]);

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != ''))
    },[inputValue])


    return { register, reset, showTable, control, errors, tableComponentRef, tableColumns, tableActions, isBtnDisable, setShowTable, onSubmitSearch }
} 