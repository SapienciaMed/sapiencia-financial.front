import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditional } from "../../../common/schemas";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IAdditionsFilters, IAdditionsWithMovements } from "../interfaces/Additions";

export function useManagementCenterAdditional( typeMovement:string ){
 
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsAdditional);

    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [showTable, setShowTable] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
        control: controlRegister,
        watch,
        reset,
    } = useForm<IAdditionsFilters>({ resolver});

    const tableColumns: ITableElement<IAdditionsWithMovements>[] = [
        {
            fieldName: "actAdminDistrict",
            header: "Acto administrativo distrito",
        },
        {
            fieldName: "actAdminSapiencia",
            header: "Acto administrativo sapiencia"
        },
        {
            fieldName: "additionMove",
            header: typeMovement === 'Adicion' ? "Total adición" : typeMovement === 'Disminucion' ? "Total disminución" : "",
            renderCell: (row) => {
                const { totalIncome, totalSpends } = row.additionMove.reduce(
                    (totals, move) => {
                      const value = parseFloat(move.value);
                      totals[move.type === "Ingreso" ? "totalIncome" : "totalSpends"] += value;
                      return totals;
                    },
                    { totalIncome: 0, totalSpends: 0 }
                  );
                return <> { totalIncome === totalSpends ? `$${totalIncome}` : <>-</> } </>
            }
        }
    ];

    const tableActions: ITableAction<IAdditionsWithMovements>[] = [
        {
            icon: "Detail",
            onClick: (row) => {},
        },
        {
            icon: "Edit",
            onClick: (row) => {                
                navigate(`./edit/${row.id}`);
            },
            
        },
    ];

    const inputValue =  watch(['adminDistrict', 'adminSapiencia'])

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    useEffect(() => {
        loadTableData()
    },[])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    useEffect(() => {            
        reset();
        if(showTable)  {
            tableComponentRef.current.emptyData();
            setShowTable(false);
        }
    }, [typeMovement]); 

    const onSubmit = handleSubmit(async (data: {actAdministrativeDistrict: string, actAdministrativeSapiencia: string, typeMovement:string}) => {
        const searchData = {
            ...data,
            typeMovement  // Esto agregará typeMovement al objeto.
        };
        setShowTable(true)
        loadTableData(searchData);
    });

    return{
        tableComponentRef,
        errors,
        isBtnDisable,
        controlRegister,
        showTable,
        tableColumns,
        tableActions,
        onSubmit,
        navigate,
        register,
        reset,
        setShowTable
    }
}