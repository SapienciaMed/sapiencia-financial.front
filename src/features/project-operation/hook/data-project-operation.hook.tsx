import { useContext, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { IProjectOperation } from "../interface/ProjectOperation";

export function useDataProjectOperation() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsValidator);
    const { setMessage } = useContext(AppContext);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
    const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const { validateActionAccess } = useContext(AppContext)

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        reset,
        watch,
        control: controlRegister
    } = useForm<any>({ resolver, mode:'all' });
    
    const inputValue =  watch(['entity','number', 'dateFrom', 'dateTo'])

    
    const tableColumns: ITableElement<IProjectOperation>[] = [
        {
            fieldName: "entity.name",
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
            fieldName: "isActivatedDescription",
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
       {
            icon: "Edit",
            hide:!validateActionAccess('PROYECTO_FUNCIONAMIENTO_EDITAR'),
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
      isBtnDisable,
      validateActionAccess
    };
} 