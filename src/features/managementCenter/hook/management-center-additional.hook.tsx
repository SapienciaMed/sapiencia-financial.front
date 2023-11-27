import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { consultFundsAdditional } from "../../../common/schemas";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IAdditionsFilters, IAdditionsWithMovements } from "../interfaces/Additions";
import { AppContext } from "../../../common/contexts/app.context";

export function useManagementCenterAdditional(typeMovement: string) {
    const { validateActionAccess } = useContext(AppContext)
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(consultFundsAdditional);

    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [showTable, setShowTable] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
        control: controlRegister,
        watch,
        reset,
    } = useForm<IAdditionsFilters>({ resolver });

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
                return <> {totalIncome === totalSpends ? `$${totalIncome}` : <>-</>} </>
            }
        }
    ];

    const tableActions: ITableAction<IAdditionsWithMovements>[] = [
        {
            icon: "Detail",
            hide:typeMovement=='Adicion' ? !validateActionAccess('ADICION_VISUALIZAR') : !validateActionAccess('DISMINUCION_VISUALIZAR'),
            onClick: (row) => {
                navigate(`./detail/${row.id}`);
            },
        },
        {
            icon: "Edit",
            hide: typeMovement=='Adicion' ? !validateActionAccess('ADICION_EDITAR') : !validateActionAccess('DISMINUCION_EDITAR'),
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },

        },
    ];

    const inputValue = watch(['adminDistrict', 'adminSapiencia'])

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    useEffect(() => {
        loadTableData()
    }, [])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    }, [inputValue])

    useEffect(() => {
        reset();
        if (showTable) {
            tableComponentRef.current.emptyData();
            setShowTable(false);
        }
    }, [typeMovement]);

    const onSubmit = handleSubmit(async (data: { actAdministrativeDistrict: string, actAdministrativeSapiencia: string, typeMovement: string }) => {
        const searchData = {
            ...data,
            typeMovement  // Esto agregará typeMovement al objeto.
        };
        setShowTable(true)
        loadTableData(searchData);
    });

    return {
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
        setShowTable,
        validateActionAccess
    }
}