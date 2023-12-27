import { useContext, useEffect, useRef, useState } from "react";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IBudgetRecordFilter } from "../interface/budget-record";
import { Controller, useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { Checkbox } from "primereact/checkbox";
import { TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { usePayrollExternalServices } from "./payroll-external-services.hook";
import { useCreditorsServices } from "../../creditors/hook/creditors-service.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fa";


export function useBudgeRecordView() {

    const navigate = useNavigate()
    const { GetRpByFilters, CancelLinkCdp } = useBudgetRecordServices();
    const { GetContractorsByDocuments, GetAllDependencies } = usePayrollExternalServices()
    const { GetCreditorsByFilters } = useCreditorsServices()

    const { setMessage, validateActionAccess } = useContext(AppContext);
    const tableComponentRef = useRef(null);

    const [dataFindRpSt, setDataFindRpSt] = useState({})
    const [dataRouteBudgetsSt, setDataRouteBudgetsSt] = useState([])
    const [isAllowSearchCdp, setIsAllowSearchCdp] = useState(false)
    const [isConfirmCancel, setIsConfirmCancel] = useState(false)

    const [dependenciesData, setDependenciesData] = useState<IDropdownProps[]>([]);
    const [contractorDocumentSt, setContractorDocumentSt] = useState('')
    const [supplierTypeSt, setSupplierTypeSt] = useState('')

    const [auroraRPConsecutiveSt, setAuroraRPConsecutiveSt] = useState('')
    const [sapRPConsecutiveSt, setSapRPConsecutiveSt] = useState('')
    const [nameSupplierSt, setNameSupplierSt] = useState('')


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
            consecutivoRpSap: '',
            consecutiveRpAurora: '',
            contractorDocument: '',
            supplierType: '',
            supplierName: '',
            supplierId: null,
            rpId: null,
            reasonCancellation: '',
            taxIdentificationId: ''
        },
        mode: 'onChange',
        /* resolver, */
    });

    const { consecutivoRpSap, consecutiveRpAurora, supplierType, supplierName, contractorDocument, taxIdentificationId } = watch()

    useEffect(() => {
        if (supplierType != '' || contractorDocument != '') {
            setNameSupplierSt(supplierName)
        } else {
            setNameSupplierSt('')
        }
    }, [supplierName])


    useEffect(() => {
        if (consecutivoRpSap != '' || consecutiveRpAurora != '') {
            GetRpByFilters({
                consecutiveRpSap: consecutivoRpSap,
                consecutiveRpAurora: consecutiveRpAurora,
            }).then(res => {
                if (Object(res).data?.length > 0) {
                    setSupplierTypeSt(Object(res)?.data[0]?.supplierType)
                    setContractorDocumentSt(Object(res)?.data[0]?.contractorDocument)
                } else {
                    setSupplierTypeSt('')
                    setContractorDocumentSt('')
                    setDataFindRpSt([])
                    setDataRouteBudgetsSt([])
                }
            })
        } else {
            setValueRegister('supplierName', '')
            setValueRegister('supplierType', '')
            setSupplierTypeSt('')
            setContractorDocumentSt('')
        }
    }, [consecutivoRpSap, consecutiveRpAurora])


    useEffect(() => {
        if (contractorDocumentSt.length == 0) {
            setContractorDocumentSt('')
        }
    }, [contractorDocumentSt])



    useEffect(() => {
        if ((Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0) && supplierName != "") {
            setIsAllowSearchCdp(true)
        } else {
            setIsAllowSearchCdp(false)
        }

        supplierType?.length > 0 && contractorDocumentSt?.length > 2
            ? setIsAllowSearchCdp(true)
            : (Number(consecutivoRpSap) > 0 || Number(consecutiveRpAurora) > 0) && supplierName != ""
                ? setIsAllowSearchCdp(true)
                : setIsAllowSearchCdp(false)
    }, [consecutivoRpSap, consecutiveRpAurora, supplierType, contractorDocumentSt, supplierName])


    useEffect(() => {
        GetAllDependencies().then(res => {
            const componentes = Object(res).data.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setDependenciesData(componentes)
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
                        taxIdentificationId: Object(res)?.data[0]?.creditor?.taxIdentification ?? taxIdentificationId,
                        identification: Object(res)?.data[0]?.contractorDocument,
                        contractName: Object(res)?.data[0]?.creditor?.name ?? supplierName,
                        dependencieName: dependenciesData.find(e => e.id == Object(res)?.data[0]?.dependencyId).name
                    }
                    setSupplierTypeSt(Object(res)?.data[0]?.supplierType)
                    setContractorDocumentSt(Object(res)?.data[0]?.contractorDocument)

                    const routeBudgets = Object(res).data?.map(e => {
                        return e.linksRp?.map(link => {
                           console.log({link})
                            return ({
                                id: link.id,
                                rpId: link.rpId, // rp Aurora
                                rpSap: e.consecutiveSap,//link.amountBudgetAvailability.cdpCode,
                                cdpPosition: link.position,
                                budgetRouteCode: link.amountBudgetAvailability.budgetRoute.budget.number,
                                initialAmount: link.initialAmount,
                                finalAmount: link.finalAmount,
                                Payments: link.pagos,
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
                    description: 'No existen resultados de búsqueda',
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({})
                        setDataFindRpSt([])
                        setDataRouteBudgetsSt([])
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
            fieldName: "rpSap",
            header: "No RP SAP"
        },
        {
            fieldName: "rpId",
            header: "No RP Aurora",
        },
        {
            fieldName: "cdpPosition",
            header: "Posicion",
        },
        {
            fieldName: "budgetRouteCode",
            header: "Ruta presupuestal",
        },
        {
            fieldName: "initialAmount",
            header: "Valor inicial",
        },
        {
            fieldName: "finalAmount",
            header: "Valor final",
            renderCell: (row) => {
                // Si finalAmount es null o 0, muestra initialAmount. De lo contrario, muestra finalAmount.
                return row.finalAmount === null || row.finalAmount === 0 
                    ? row.initialAmount 
                    : row.finalAmount;
            }
        },
        {
            fieldName: "rpId",
            header: "Anular posición",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        {
                            validateActionAccess('RP_ANULAR_MONTO') && (
                                <Checkbox onChange={() => showModalCancelAmount(row)} checked={false} disabled={row.rpSap > 0 || row.payments?.length > 0 ? true : false} />
                            )
                        }
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            hide: !validateActionAccess('RP_RUTAS_EDITAR'),
            onClick: (row) => {
                { row.rpId }
                navigate(`./edit/${row.rpId}/idRp/${row.id}`);
            },
        }
    ];


    const showModalCancelAmount = (row: object) => {
        setMessage({
            title: "Observación anulado",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                const { reasonCancellation } = watch()
                if (reasonCancellation.length == 0) {
                    setMessage({
                        title: 'Anulación no permitida',
                        description: 'Debe registrar un motivo de anulación',
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({})
                        }
                    })
                    return;
                };
                setMessage({})
                setValueRegister('reasonCancellation', '')
                CancelLinkCdp(`${Object(row).id}`, {
                    isActive: false,
                    reasonCancellation
                }).then(res => {
                    res.operation.code == 'OK' && setIsConfirmCancel(!isConfirmCancel)
                })

                setDataRouteBudgetsSt(dataRouteBudgetsSt.filter(el => el.id != Object(row).id))
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
        if (!supplierType && supplierTypeSt.length == 0) return;
        if (contractorDocumentSt.length > 0) {
            supplierType == 'Contratista' || supplierTypeSt == 'Contratista'
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
                        const contractorName = Object(res).data?.data[0]?.firstName + " " +
                            Object(res).data.data[0]?.secondName + " " +
                            Object(res).data.data[0]?.surname + " " +
                            Object(res).data.data[0]?.secondSurname;

                        setValueRegister('supplierName', contractorName)
                        setValueRegister('taxIdentificationId', Object(res).data?.data[0]?.fiscalIdentification)
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
                        if (Object(res).data.array.length == 0 && contractorDocumentSt.length > 0) {
                            messageValidateSupplier('Acreedor')
                            setValueRegister('supplierName', '')
                            setValueRegister('supplierId', null)
                            return;
                        }
                        if (contractorDocumentSt.length > 0) {
                            setValueRegister('supplierName', Object(res).data.array[0]?.name)
                            setValueRegister('supplierId', Object(res).data.array[0]?.id)
                        }
                    })
                )
        }
    }, [supplierType, contractorDocumentSt])


    const actionTemplate = (rowData) => {
        return (
            validateActionAccess('RP_DATOS_BASICOS_EDITAR') && (
                <Icons.FaPencilAlt
                    className="button grid-button button-edit"
                    style={{ color: '#4caf50', fontSize: '1.5em' }}
                    title="Editar"
                    onClick={() => navigate(`editar-rp/${JSON.stringify(rowData.consecutiveRpAurora)}`)}
                />
            )
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
        setContractorDocumentSt,
        setAuroraRPConsecutiveSt,
        setSapRPConsecutiveSt,
        nameSupplierSt,
        validateActionAccess
    };



}