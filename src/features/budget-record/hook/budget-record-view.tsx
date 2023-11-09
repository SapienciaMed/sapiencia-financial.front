import { useContext, useEffect, useRef, useState } from "react";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IBudgetRecord, IBudgetRecordFilter } from "../interface/budget-record";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";


export function useBudgeRecordView() {

    const { GetRpByFilters } = useBudgetRecordServices();
    const { setMessage, authorization } = useContext(AppContext);
    const tableComponentRef = useRef(null);

    const [dataFindRpSt, setDataFindRpSt] = useState({})
    const [dataRouteBudgetsSt, setDataRouteBudgetsSt] = useState([])

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues,
        reset
    } = useForm<IBudgetRecordFilter>({
        defaultValues: {
            consecutivoRpSap: null,
            consecutiveRpAurora: null,
            contractorDocument: '',
            supplierType: '',
            supplierName: ''
        },
        mode: 'onChange',
        /* resolver, */
    });


    const onSubmitFiltersRp = handleSubmit(async (data: IBudgetRecordFilter) => {

        GetRpByFilters({
            consecutiveRpSap: data.consecutivoRpSap,
            consecutiveRpAurora: data.consecutiveRpAurora,
            supplierType: data.supplierType,
            contractorDocument: data.contractorDocument
        }).then(res => {
            try {

                if (Object(res).data.length > 0) {
                    let data =
                    {
                        consecutiveRpSap: Object(res)?.data[0]?.consecutiveSap,
                        consecutiveRpAurora: Object(res)?.data[0]?.id,
                        taxIdentificationId: Object(res)?.data[0]?.creditor.taxIdentification,
                        identification: Object(res)?.data[0]?.contractorDocument,
                        contractName: Object(res)?.data[0]?.creditor.name,
                        dependencieName: Object(res)?.data[0]?.dependencyId
                    }


                    const routeBudgets = Object(res).data[0]?.linksRp?.map(link => {
                        return ({
                            rpId: link.rpId,
                            cdpCode: link.amountBudgetAvailability.cdpCode,
                            cdpPosition: link.amountBudgetAvailability.cdpPosition,
                            project: "Nombre proyecto",
                            fundCode: link.amountBudgetAvailability.budgetRoute.fund.number,
                            pospreCode: link.amountBudgetAvailability.budgetRoute.pospreSapiencia.number,
                            initialAmount: 2000,
                        }
                        )
                    })

                    setDataFindRpSt(data)
                    setDataRouteBudgetsSt(routeBudgets)
                } else {
                    setDataFindRpSt([])
                    setDataRouteBudgetsSt([])
                    
                }
            } catch (error) {
                alert(error)
            }
        })

    })

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "cdpCode",
            header: "Consecutivo CDP SAP"
        },
        {
            fieldName: "cdpPosition",
            header: "Posicion CDP",
        },
        {
            fieldName: "project",
            header: "Proyecto",
        },
        {
            fieldName: "fundCode",
            header: "Fondo",
        },
        {
            fieldName: "pospreCode",
            header: "Pospre",
        },
        {
            fieldName: "initialAmount",
            header: "Valor inicial RP",
        },
        {
            fieldName: "rpId",
            header: "Vincular",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        {row.rpId}
                        {/* <Checkbox inputId={row.id} name="row" value={row} onChange={onAmountChange} checked={selectedAmounts?.some((item) => item.id == row.id)} /> */}
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                {row.rpId}
                /* showModalChangeAmount(row.id) */
            },
        }
    ];



    return {
        control,
        errors,
        register,
        onSubmitFiltersRp,
        watch,
        setMessage,
        getValues,
        tableColumns,
        tableActions,
        tableComponentRef,
        dataFindRpSt,
        dataRouteBudgetsSt,
        reset
    };



}