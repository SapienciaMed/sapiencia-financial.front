import { useContext, useEffect, useRef, useState } from "react";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IBudgetRecord, IBudgetRecordFilter } from "../interface/budget-record";
import { Controller, useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { Checkbox } from "primereact/checkbox";
import { TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";


export function useBudgeRecordView() {

    const { GetRpByFilters } = useBudgetRecordServices();
    const { setMessage, authorization } = useContext(AppContext);
    const tableComponentRef = useRef(null);

    const [dataFindRpSt, setDataFindRpSt] = useState({})
    const [dataRouteBudgetsSt, setDataRouteBudgetsSt] = useState([])
    const [isAllowSearchCdp, setIsAllowSearchCdp] = useState(false)

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
            supplierName: '',
            rpId:null,
            reasonCancellation:''
        },
        mode: 'onChange',
        /* resolver, */
    });

    const { consecutivoRpSap, consecutiveRpAurora, supplierType, contractorDocument } = watch()


    useEffect(() => {
        console.log({ consecutivoRpSap })
        Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0
            ? setIsAllowSearchCdp(true)
            : setIsAllowSearchCdp(false)

        supplierType.length > 0 && contractorDocument.length > 2
            ? setIsAllowSearchCdp(true)
            : Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0
                ? setIsAllowSearchCdp(true)
                : setIsAllowSearchCdp(false)
    }, [consecutivoRpSap, consecutiveRpAurora, supplierType, contractorDocument])



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


                    const routeBudgets = Object(res).data?.map(e=>{
                        return e.linksRp?.map(link => {
                            return ({
                                rpId: link.rpId,
                                cdpCode: link.amountBudgetAvailability.cdpCode,
                                cdpPosition: link.amountBudgetAvailability.cdpPosition,
                                project: "Nombre proyecto",
                                fundCode: link.amountBudgetAvailability.budgetRoute.fund.number,
                                pospreCode: link.amountBudgetAvailability.budgetRoute.pospreSapiencia.number,
                                initialAmount: link.initialAmount,
                                actions:()=>{
                                    
                                }
                            }
                            )
                        }) 
                    })

                    setDataFindRpSt(data)
                    setDataRouteBudgetsSt(routeBudgets.flat())
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
            header: "Anular",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        <Checkbox onChange={() => showModalCancelAmount(row)}  /* onChange={onAmountChange} */ checked={false} />
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                { row.rpId }
                /* showModalChangeAmount(row.id) */
            },
        }
    ];


    const showModalCancelAmount = (row: object) => {
        setMessage({
            title: "Observación anulado",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                const { reasonCancellation, rpId } = watch()
                setMessage({})
                setValueRegister('reasonCancellation','')
                //alert(reasonCancellation)
                //alert(Object(row).rpId)
                //amountWatch.amounts[0].reasonCancellation != ""
                //    ? (cancelAmount({
                //        id,
                //        reasonCancellation: amountWatch.amounts[0].reasonCancellation
                //    }).then(res => {
                //        getCdpById(cdpId).then(res => {
                //            setCdpFoundSt(res.data[0])
                //        })
                //        setMessage({})
                //        setValueRegister('amounts.0.reasonCancellation','')
                //    }))
                //    : ''

            },
            onClose() {
                setMessage({})
            },
            description: <div style={{ width: '100%' }}>
                <label>Digite el motivo de la anulación</label>
                <div>
                    <Controller
                        control={control}
                        name={'reasonCancellation'}
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    className="text-area-basic"
                                    register={register}
                                    label="Motivo"
                                    classNameLabel="text-black biggest bold"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onChange={field.onChange}
                                />
                            );
                        }}
                    />

                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="title-button font-big">
                        Max. 500 caracteres
                    </div>
                </div>

            </div>,
            background: true
        })

    }


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
        reset,
        setDataFindRpSt,
        setDataRouteBudgetsSt,
        isAllowSearchCdp
    };



}