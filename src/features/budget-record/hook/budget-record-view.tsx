import { useContext, useEffect, useRef, useState } from "react";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IBudgetRecord, IBudgetRecordFilter } from "../interface/budget-record";
import { Controller, useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { Checkbox } from "primereact/checkbox";
import { TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { usePayrollExternalServices } from "./payroll-external-services.hook";
import { useCreditorsServices } from "../../creditors/hook/creditors-service.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fa";


export function useBudgeRecordView() {

    const navigate = useNavigate()
    const { GetRpByFilters, CancelLinkCdp, GetAllComponents } = useBudgetRecordServices();
    const { GetContractorsByDocuments } = usePayrollExternalServices()
    const { GetCreditorsByFilters } = useCreditorsServices()

    const { setMessage, authorization } = useContext(AppContext);
    const tableComponentRef = useRef(null);

    const [dataFindRpSt, setDataFindRpSt] = useState({})
    const [dataRouteBudgetsSt, setDataRouteBudgetsSt] = useState([])
    const [isAllowSearchCdp, setIsAllowSearchCdp] = useState(false)
    const [isConfirmCancel, setIsConfirmCancel] = useState(false)

    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [contractorDocumentSt, setContractorDocumentSt] = useState('')

  

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
            supplierId: null,
            rpId: null,
            reasonCancellation: ''
        },
        mode: 'onChange',
        /* resolver, */
    });

    const { consecutivoRpSap, consecutiveRpAurora, supplierType, reasonCancellation } = watch()
    
    useEffect(() => {
        console.log({ consecutivoRpSap })
        Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0
            ? setIsAllowSearchCdp(true)
            : setIsAllowSearchCdp(false)

        supplierType?.length > 0 && contractorDocumentSt?.length > 2
            ? setIsAllowSearchCdp(true)
            : Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0
                ? setIsAllowSearchCdp(true)
                : setIsAllowSearchCdp(false)
    }, [consecutivoRpSap, consecutiveRpAurora, supplierType, contractorDocumentSt])

    
    useEffect(() => {
        GetAllComponents().then(res => {
            const componentes = res.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setComponentsData(componentes)
        })

    }, [])


    const onSubmitFiltersRp = handleSubmit(async (data: IBudgetRecordFilter) => {

        data.contractorDocument = contractorDocumentSt

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
                        dependencieName: componentsData.find(e=>e.id==Object(res)?.data[0]?.dependencyId).name
                    }


                    const routeBudgets = Object(res).data?.map(e => {
                        return e.linksRp?.map(link => {
                            return ({
                                id: link.id,
                                rpId: link.rpId,
                                cdpCode: link.amountBudgetAvailability.cdpCode,
                                cdpPosition: link.amountBudgetAvailability.cdpPosition,
                                project: link.projectName,
                                fundCode: link.amountBudgetAvailability.budgetRoute.fund.number,
                                pospreCode: link.amountBudgetAvailability.budgetRoute.pospreSapiencia.number,
                                initialAmount: link.initialAmount,
                                actions: () => {

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
                setMessage({
                    title: `Sin coincidencia`,
                    description:'No existen resultados de búsqueda',
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({})
                    },
                    onClose() {
                        setMessage({})
                    }
                }
                )
            }
        })

    })

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "cdpCode",
            header: "Consecutivo RP SAP"
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
                navigate(`./edit/${row.rpId}`); 
            },
        }
    ];


    const showModalCancelAmount = (row: object) => {
        console.log(row)
        setMessage({
            title: "Observación anulado",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                const { reasonCancellation } = watch()
                setMessage({})
                setValueRegister('reasonCancellation', '')
                CancelLinkCdp(`${Object(row).id}`, {
                    isActive: false,
                    reasonCancellation
                }).then(res => {
                    res.operation.code == 'OK' && setIsConfirmCancel(!isConfirmCancel)
                })

                setDataRouteBudgetsSt(dataRouteBudgetsSt.filter(el=>el.id!=Object(row).id))
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

    const messageValidateSupplier = (type: string) => {
        setMessage({
            title: `${type} no existe`,
            show: true,
            OkTitle: "Aceptar",
            onOk: () => {
                setMessage({})
            },
            onClose() {
                setMessage({})
            }
        }
        )
    }

    useEffect(() => {
        if (!supplierType) return;
        if (contractorDocumentSt.length > 0) {
            supplierType == 'Contratista'
                ? (
                    GetContractorsByDocuments({
                        documentList: [contractorDocumentSt]
                    }).then(res => {
                        if (Object(res).data.data?.length == 0) {
                            messageValidateSupplier('Contratista')
                            setValueRegister('supplierName', '')
                            setValueRegister('supplierId', null)
                            return;
                        }
                        console.log({res})
                        const contractorName = Object(res).data?.data[0]?.firstName + " " +
                            Object(res).data.data[0]?.secondName + " " +
                            Object(res).data.data[0]?.surname + " " +
                            Object(res).data.data[0]?.secondSurname;

                        setValueRegister('supplierName', contractorName)
                        setValueRegister('supplierId', null)
                    })

                )
                :
                (
                    GetCreditorsByFilters({
                        id: null,
                        document: contractorDocumentSt,
                        page: 1,
                        perPage: 1000
                    }).then(res => {
                        if (Object(res).data.array.length == 0) {
                            messageValidateSupplier('Acreedor')
                            setValueRegister('supplierName', '')
                            setValueRegister('supplierId', null)
                            return;
                        }
                        setValueRegister('supplierName', Object(res).data.array[0]?.name)
                        setValueRegister('supplierId', Object(res).data.array[0]?.id)

                    })
                )
        }
    }, [supplierType, contractorDocumentSt])

    
    const actionTemplate = (rowData) => {
        return (
            <Icons.FaPencilAlt 
            className="button grid-button button-edit"
            style={{color:'#4caf50', fontSize:'1.5em'}} 
            onClick={() => navigate(`editar-rp/${JSON.stringify(rowData.consecutiveRpAurora)}`)}
            />
            
        );
    };


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
        isAllowSearchCdp,
        isConfirmCancel,
        actionTemplate,
        setContractorDocumentSt
    };



}