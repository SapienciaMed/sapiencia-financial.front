import { useForm } from "react-hook-form";
import { pospreSapienciaValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useContext, useEffect, useRef, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useNavigate } from "react-router-dom";
import { IPosPreSapiencia, IPospreSapienciaData } from "../interfaces/PosPreSapiencia";
import { AppContext } from "../../../common/contexts/app.context";
import DetailsComponent from "../../../common/components/details.component";

interface IPospreSapienciaFilters {
    inputPospreSapiencia: string
}

export function usePospreSapienciaData({budgetsId, validateAction }: IPospreSapienciaData) {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(pospreSapienciaValidator);
    const { setMessage } = useContext(AppContext);
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
            header: "Pospre sapiencia",
        },
        {
            fieldName: "number",
            header: "Pospre sapiencia"
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
                const rows = [
                    {
                        title: "Pospre origen",
                        value: `${row.budget.number}`
                    },
                    {
                        title: "Pospre sapiencia",
                        value: `${row.number}`
                    },
                    {
                        title: "Ejercicio",
                        value: `${row.ejercise}`
                    },
                    {
                        title: "Descripción",
                        value: `${row.description}`
                    },
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

    const tableActionEdit: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./pospre-sapiencia/edit/${row.id}`);
            },
        },
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Pospre origen",
                        value: `${row.budget.number}`
                    },
                    {
                        title: "Pospre sapiencia",
                        value: `${row.number}`
                    },
                    {
                        title: "Ejercicio",
                        value: `${row.ejercise}`
                    },
                    {
                        title: "Descripción",
                        value: `${row.description}`
                    },
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
    ]

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
        if(budgetsId && validateAction == 'new') loadTableData({ budgetId: budgetsId});
    }, []);

    useEffect(() => {
        if (validateAction == 'view') loadTableData({  budgetIdOrig: budgetsId })
    },[])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])


    return { register, reset, showTable, control, errors, tableComponentRef, tableColumns, tableActions, isBtnDisable, tableActionEdit,
        tableColumnsView, tableActionsView, setShowTable, onSubmitSearch }
} 