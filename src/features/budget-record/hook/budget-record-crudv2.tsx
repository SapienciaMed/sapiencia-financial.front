import { useContext, useEffect, useRef, useState } from "react";
import { IMessage } from "../../../common/interfaces/global.interface";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IBudgetRecord, IBudgetRecordv2 } from "../interface/budget-record";
import { budgetRecordCrudValidator } from "../../../common/schemas/budget-record-validator";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { useCdpServices } from "../../budget-availability/hooks/useCdpServices";
import { Checkbox } from "primereact/checkbox";
import { InputComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useCreditorsServices } from "../../creditors/hook/creditors-service.hook";
import { usePayrollExternalServices } from "./payroll-external-services.hook";


export function useBudgeRecordCrudv2() {

    const resolver = useYupValidationResolver(budgetRecordCrudValidator);
    const { CreateBudgetRecord, GetAllComponents, GetAllActivityObjectContract } = useBudgetRecordServices();
    const { GetRoutesByValidity } = useCdpServices()
    const { GetCreditorsByFilters } = useCreditorsServices()
    const { GetAllDependencies, GetContractorsByDocuments } = usePayrollExternalServices()
    const { setMessage, authorization, validateActionAccess } = useContext(AppContext);

    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [activityObjectContractData, setActivityObjectContractData] = useState<IDropdownProps[]>([]);

    const [isBtnSearchAmountsSt, setIsBtnSearchAmountsSt] = useState(false)
    const [dataAmounts, setDataAmounts] = useState<any[]>([])
    const [selectedAmounts, setSelectedAmounts] = useState([]);
    const [confirmChangeAmountSt, setConfirmChangeAmountSt] = useState({ id: null, amount: null })
    const [isAllowSave, setIsAllowSave] = useState(false)
    const navigate = useNavigate();

    const tableComponentRef = useRef(null);

    // se suma un dia adicional por ajuste
    const lastDayPerMont = {
        "01": 32,
        "02": 29,
        "03": 32,
        "04": 31,
        "05": 32,
        "06": 31,
        "07": 32,
        "08": 32,
        "09": 31,
        "10": 32,
        "11": 31,
        "12": 32,
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const lastDateMonth = `${year}-${formattedMonth}-${lastDayPerMont[formattedMonth]}`

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues
    } = useForm<IBudgetRecordv2>({
        defaultValues: {
            supplierType: '',
            supplierName: '',
            consecutiveCdpSap: null,
            consecutiveCdpAurora: null,
            supplierId: null,
            contractorDocument: '',
            documentDate: new Date(today),
            dateValidity: new Date(lastDateMonth),
            dependencyId: null,
            contractualObject: '',
            componentId: null,
            consecutiveSap: null,
            contractNumber: '',
            responsibleDocument: '',
            supervisorDocument: '',
            userCreate: authorization?.user?.numberDocument!,
            userModify: '',
            dateCreate: '',
            dateModify: '',
            idAmountToModify: null,
            newAmount: null,
            maxAmount: null,
            linksRp: [
                {
                    rpId: null,
                    amountCdpId: null,
                    initialAmount: null,
                    isActive: null,
                    reasonCancellation: '',
                    creditAmount: null,
                    againtsAmount: null,
                    fixedCompleted: null,
                    finalAmount: null,
                    position: null,
                    observation: '',
                    amountBudgetAvailability: null,
                    budgetRecord: null,
                }
            ],
        },
        mode: 'onSubmit',
        resolver,
    });

    useEffect(() => {
        GetAllComponents().then(res => {
            const componentes = res.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setComponentsData(componentes)
        })

        GetAllDependencies().then(res => {
            const dependencies = Object(res).data.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setDependeciesData(dependencies)
        })

        GetAllActivityObjectContract().then(res => {
            const activities = Object(res).data?.map(e => ({ id: e.id, name: e.description, value: e.description }))
            setActivityObjectContractData(activities)
        })
    }, [])


    const { supplierType, contractorDocument, consecutiveCdpAurora, consecutiveCdpSap} = watch()

    useEffect(() => {
        if (
            selectedAmounts?.length>0 && isBtnSearchAmountsSt
            ) {
            setIsAllowSave(true)
        }else{
            setIsAllowSave(false)
        }
    }, [selectedAmounts])
    

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


    /* Identificación del usuario */
    useEffect(() => {
        if (!supplierType) return;
        if (contractorDocument.length > 0) {
            supplierType == 'Contratista'
                ? (
                    GetContractorsByDocuments({
                        documentList: [contractorDocument]
                    }).then(res => {
                        if (Object(res).data.data.length == 0) {
                            messageValidateSupplier('Contratista')
                            setValueRegister('supplierName', '')
                            setValueRegister('supplierId', null)
                            return;
                        }
                        const contractorName = Object(res).data.data[0]?.firstName + " " +
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
                        document: contractorDocument,
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
    }, [supplierType, contractorDocument])


    // buscar el codigo cdpSAp a partir del codigo ahora cdp
    useEffect(() => {
        if (consecutiveCdpAurora) {
            setDataAmounts([])
            setIsAllowSave(false)
            setIsBtnSearchAmountsSt(false)
            if (consecutiveCdpAurora) {
                GetRoutesByValidity({
                    page: 1,
                    perPage: 1,
                    consecutiveSap: null,
                    consecutiveAurora: consecutiveCdpAurora,
                }).then(res => {
                    setValueRegister('consecutiveCdpSap', res.data.array[0]?.sapConsecutive)
                    setSelectedAmounts(res.data.array[0]?.amounts.filter(e => e.isActive == true))
                })
            }
        }
    }, [consecutiveCdpAurora])



    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "sapConsecutive",
            header: "Consecutivo CDP SAP"
        },
        {
            fieldName: "cdpPosition",
            header: "Posicion CDP",
        },
        {
            fieldName: "projectName",
            header: "Proyecto",
        },
        {
            fieldName: "fundCode",
            header: "Fondo",
        },
        {
            fieldName: "pospreCode",
            header: "Pospre"
        },
        {
            fieldName: "amount",
            header: "Valor inicial RP",
        },
        {
            fieldName: "",
            header: "Vincular",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        {
                           validateActionAccess('RP_ASOCIAR_RUTAS') && (
                               <Checkbox inputId={row.id} name="row" value={row} onChange={onAmountChange} checked={selectedAmounts?.some((item) => item.id == row.id)} />
                           ) 
                        }
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                showModalChangeAmount(row)
            },
        }
    ];

    useEffect(() => {
        if (consecutiveCdpSap > 0) {
            GetRoutesByValidity({
                page: 1,
                perPage: 20,
                consecutiveSap: consecutiveCdpSap,
                consecutiveAurora: consecutiveCdpAurora,
            }).then(res => {
               
                if(res.data.array.length==0){
                    setMessage({
                        title: `Datos no encontrados`,
                        description: 'No existe CDP asociado a los valores de búsqueda',
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({})
                            setValueRegister('newAmount', null)
                        }
                    })
                }

                const dataCdp = res.data.array.map(e => {
                    return e.amounts.map(el => {

                        let rpAmountsAssoc = el.linkRpcdps.reduce((acumulator, obj) => {
                            return acumulator + obj.finalAmount;
                          }, 0);

                        return ({
                            id: el.id,
                            sapConsecutive: e.sapConsecutive,
                            cdpPosition: el.cdpPosition,
                            projectName: el.projectName,
                            fundCode: el.budgetRoute.fund.number,
                            pospreCode: el.budgetRoute.fund.number,
                            amount: (parseFloat(el.amount) - parseFloat(rpAmountsAssoc)).toFixed(2),
                            amountCdpId: el.id
                        })
                    })
                })
                setDataAmounts(dataCdp.flat())
                setSelectedAmounts(res.data.array[0]?.amounts.filter(e => e.isActive == true))
            })
        }
    }, [isBtnSearchAmountsSt])


    useEffect(() => {


        const dataCdp = dataAmounts.map(el => {
            return ({
                id: el.id,
                sapConsecutive: el.sapConsecutive,
                cdpPosition: el.cdpPosition,
                projectName: el.projectName,
                fundCode: el.fundCode,
                pospreCode: el.pospreCode,
                amount: confirmChangeAmountSt?.amount && confirmChangeAmountSt.id == el.id ? parseFloat(confirmChangeAmountSt.amount).toFixed(2) : parseFloat(el.amount).toFixed(2),
                amountCdpId: el.amountCdpId
            })
        })

        setDataAmounts(dataCdp)
        //setSelectedAmounts(dataAmounts.filter(e => e.isActive == true))


    }, [confirmChangeAmountSt])



    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }


    useEffect(() => {
        loadTableData({
            page: 1,
            perPage: 100,
        });
    }, [])

    const onAmountChange = (e) => {
        let _selectedAmounts = [...selectedAmounts];
        if (e.checked) {
            _selectedAmounts.push(e.value);
        } else {
            _selectedAmounts = _selectedAmounts.filter(r => r.id !== e.value.id);
        }
        setSelectedAmounts(_selectedAmounts)
    };


    useEffect(() => {
        let amountRoute = dataAmounts?.map((e: any, index: number) => {
            return ({
                id: e.id,
                key: e.id,
                amountCdpId: e.amountCdpId,
                initialAmount: confirmChangeAmountSt?.amount && confirmChangeAmountSt.id == e.id ? confirmChangeAmountSt.amount : e.amount,
                isActive: e.isActive,
                reasonCancellation: "",
                rpId: null,
                position: index + 1,
                finalAmount:confirmChangeAmountSt?.amount && confirmChangeAmountSt.id == e.id ? confirmChangeAmountSt.amount : e.amount,
            })
        })
        let amountRouteToSave = [];
        selectedAmounts?.forEach(e => {
            let matchAmount = amountRoute?.find(el => el.id == e.id)
            if (matchAmount) {
                delete matchAmount.id;
                amountRouteToSave.push(matchAmount)
            }
        })
        setValueRegister('linksRp', amountRouteToSave)
    }, [dataAmounts, selectedAmounts, confirmChangeAmountSt])

    const formatDate = (dateUTC: Date) => {
        let year = new Date(dateUTC).getUTCFullYear();
        let month = new Date(dateUTC).getUTCMonth() + 1; // Los meses en JavaScript van de 0 a 11
        let day = new Date(dateUTC).getUTCDate() + 1;
        let fechaFormateada = year + '-' + pad(month) + '-' + pad(day)
        return fechaFormateada
    }

    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    const onSubmitRP = handleSubmit(async (data: IBudgetRecord) => {
        data.documentDate = formatDate(new Date(data.documentDate))
        data.dateValidity = formatDate(new Date(data.dateValidity))
        
        showModal({
            title: "Guardar",
            description: "¿Está segur@ de guardar la información?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({})
                messageConfirmSave(data)
                //setIsLoading(true)
            },
            onCancel: () => {
                setMessage({})
                //setIsLoading(false)
            },
            onClose: () => {
                setMessage({})
                //setIsLoading(false)
            },
            background: true
        })


    });


    const messageConfirmSave = (data: any) => {
        CreateBudgetRecord(data).then(res => {
            Object(res).operation.code == 'OK'
                ? showModal({
                    title: "Guardado",
                    description: "¡Guardado exitosamente!",
                    onOk: (() => {
                        setMessage({})
                        showAuroraCodeConfirmSave(res.data)
                    }),
                    OkTitle: "Aceptar",
                })
                : showModal({
                    title: "Falla en almacenamiento",
                    description: "Falla en creación",
                    onOk: (() => setMessage({})),
                    OkTitle: "Aceptar",
                })
        })
    }

    const showAuroraCodeConfirmSave = (data: any) => {
        showModal({
            title: "Consecutivo RP Aurora",
            description: `Al RP se le asignó el consucutivo ${data.id}`,
            onOk: (() => {
                setMessage({})
                navigate('../')
            }),
            OkTitle: "Cerrar",
        })
    }

    const showModal = (values: IMessage) => {
        setMessage({
            title: values.title,
            description: values.description,
            show: true,
            OkTitle: values.OkTitle,
            onOk: values.onOk || (() => setMessage({})),
            cancelTitle: values.cancelTitle
        });
    };

    const showModalChangeAmountForm = (values: IMessage) => {
        setMessage({
            title: values.title,
            show: true,
            OkTitle: "Aceptar",
            onOk: () => {
                const newAmount = getValues('newAmount')
                const newAmountFloat = parseFloat(newAmount.toString());
                const maxAmount = getValues('maxAmount')
                const maxAmountFloat = parseFloat(maxAmount.toString())
                const idAmountToModify = getValues('idAmountToModify')
                if (newAmountFloat > 0 && newAmountFloat <= maxAmountFloat) {
                    setConfirmChangeAmountSt({ id: idAmountToModify, amount: Number(newAmount) })
                    setMessage({})
                    setValueRegister('newAmount', null)
                } else {
                    setMessage({
                        title: `Valor no valido`,
                        description: 'El monto modificado debe ser mayor que cero y menor o igual que el monto inicial',
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({})
                            setValueRegister('newAmount', null)
                        },
                        onClose() {
                            setMessage({})
                            setValueRegister('newAmount', null)
                        }
                    })
                }
            },
            cancelTitle: values.cancelTitle,
            description: <div style={{ width: '100%' }}>
                <label>Digite el valor inicial</label>
                <div>
                    <Controller
                        control={control}
                        name={"newAmount"}
                        render={({ field }) => (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                className="input-basic medium"
                                typeInput="number"
                                register={register}
                                label="Valor"
                                classNameLabel="text-black big bold text-required"
                                direction={EDirection.column}
                                errors={errors}
                                onChange={(value) => field.onChange(value)}
                            />
                        )} />
                </div>
            </div>,
            background: true
        });
    };


    const showModalChangeAmount = (row: any) => {
        setValueRegister('idAmountToModify', row.id)
        GetRoutesByValidity({
            page: 1,
            perPage: 20,
            consecutiveSap: row.sapConsecutive,
            consecutiveAurora: null,
        }).then(res => {
            const amountFound = res.data.array[0].amounts.find(e => e.id == row.id)
            const maxAmount = amountFound.amount;
            setValueRegister('maxAmount', maxAmount)
            showModalChangeAmountForm({
                title: `Editar valor inicial: $${maxAmount}`
            })
        })
    }

    return {
        control,
        errors,
        register,
        onSubmitRP,
        tableComponentRef,
        componentsData,
        dependeciesData,
        activityObjectContractData,
        dataAmounts,
        setMessage,
        tableColumns,
        tableActions,
        isBtnSearchAmountsSt,
        setIsBtnSearchAmountsSt,
        consecutiveCdpSap,
        isAllowSave
    };
}