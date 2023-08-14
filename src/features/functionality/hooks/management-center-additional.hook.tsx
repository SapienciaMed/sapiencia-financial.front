import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditional } from "../../../common/schemas";
import { useNavigate } from "react-router-dom";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IAdditionsFilters, IAdditionsWithMovements } from "../interfaces/Additions";
import { useAdditionsTransfersService } from "./additions-transfers-service.hook";

export function useManagementCenterAdditional(){

    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsAdditional);

    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [AdditionsByDistrictData, setAdditionsByDistrictData] = useState<IDropdownProps[]>([]);
    const [AdditionsBySapienciaData, setAdditionsBySapienciaData] = useState<IDropdownProps[]>([]);
    const [showTable, setShowTable] = useState(false);
    const { GetAllAdditionsByDistrict, GetAllAdditionsBySapiencia } = useAdditionsTransfersService()

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
            header: "Total adición",
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
            onClick: (row) => {},
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
        GetAllAdditionsByDistrict().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const typeTransfers = response.data;
                const arrayEntities = typeTransfers.map((entity) => {
                    return { name: entity.actAdminDistrict, value: entity.actAdminDistrict };
                });
                setAdditionsByDistrictData(arrayEntities)
            }

        }).catch((error) => console.log(error));

        GetAllAdditionsBySapiencia().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const typeTransfers = response.data;
                const arrayEntities = typeTransfers.map((entity) => {
                    return { name: entity.actAdminSapiencia, value: entity.actAdminSapiencia };
                });
                setAdditionsBySapienciaData(arrayEntities)
            }
        }).catch((error) => console.log(error))

    },[])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != null))
    },[inputValue])

    const onSubmit = handleSubmit(async (data: {actAdministrativeDistrict: string, actAdministrativeSapiencia: string}) => {
        setShowTable(true)
        loadTableData(data);
    });

    return{
        tableComponentRef,
        errors,
        isBtnDisable,
        controlRegister,
        AdditionsByDistrictData,
        showTable,
        tableColumns,
        tableActions,
        AdditionsBySapienciaData,
        onSubmit,
        navigate,
        register,
        reset,
        setShowTable
    }
}