import { useContext, useEffect, useRef, useState } from "react";
import { IMessage } from "../../../common/interfaces/global.interface";
import { IErrorTablePac } from "../../pac/interface/Pac";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IBudgetRecord } from "../interface/budget-record";
import { budgetRecordCrudValidator } from "../../../common/schemas/budget-record-validator";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { useCdpServices } from "../../budget-availability/hooks/useCdpServices";
import { Checkbox } from "primereact/checkbox";
import { InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useCreditorsServices } from "../../creditors/hook/creditors-service.hook";
import { usePayrollExternalServices } from "./payroll-external-services.hook";


export function useBudgeRecordCrud() {

    const resolver = useYupValidationResolver(budgetRecordCrudValidator);
    const { CreateBudgetRecord, GetAllComponents, GetAllActivityObjectContract } = useBudgetRecordServices();
    const { GetRoutesByValidity } = useCdpServices()
    const { GetCreditorsByFilters } = useCreditorsServices()
    const { GetAllDependencies, GetContractorsByDocuments } = usePayrollExternalServices()
    const { setMessage, authorization } = useContext(AppContext);

    const navigate = useNavigate();

    const tableComponentRef = useRef(null);
    const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)
    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [activityObjectContractData, setActivityObjectContractData] = useState<IDropdownProps[]>([]);
    const [contractorsData, setContractorsData] = useState<IDropdownProps[]>([]);
    const [creditorsData, setCreditorsData] = useState<IDropdownProps[]>([]);
    const [isAllowSave, setIsAllowSave] = useState(false)

    const [dataAmounts, setDataAmounts] = useState<any[]>([])
    const [selectedAmounts, setSelectedAmounts] = useState([]);

    const [contractorDocumentSt, setContractorDocumentSt] = useState('')
    const [contractualObjectSt, setContractualObjectSt] = useState('')
    const [findAmountsSt, setFindAmountsSt] = useState({ sab: null, aurora: null })
    const [mountEditSt, setMountEditSt] = useState({ id: null, amount: null })
    const [confirmChangeAmountSt, setConfirmChangeAmountSt] = useState({ id: null, amount: null })

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
    } = useForm<IBudgetRecord>({
        defaultValues: {
            id: null,
            supplierType: "",
            supplierId: null,
            supplierName: "",
            contractorDocument: "",
            documentDate: new Date(today).toISOString(),
            dateValidity: new Date(lastDateMonth).toISOString(),
            dependencyId: null,
            contractualObject: "",
            componentId: null,
            userCreate: authorization?.user?.numberDocument!,
            userModify: "",
            dateModify: "",
            consecutiveCdpAurora: null,
            consecutiveCdpSap: null,
            newAmount: null,
            maxAMount: null,
            mountSelected: null,
            linksRp: [
                {
                    id: null,
                    amountCdpId: null,
                    initialAmount: null,
                    isActive: true,
                    reasonCancellation: "",
                    rpId: null
                }
            ]
        },
        mode: 'onChange',
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


    const showModalChangeAmount = (row: any) => {

        const { newAmount, maxAMount, mountSelected } = watch()
        const linksCdp = getValues('linksRp')
        const initialAmount = (linksCdp.find((el: any) => el.key == row.id)).initialAmount
        const initialAmountF = parseFloat(initialAmount.toString())

        if (mountSelected == null) {
            setValueRegister('mountSelected', row.id)
            setValueRegister('maxAMount', initialAmountF)
        } else {
            mountSelected != row.id && setValueRegister('maxAMount', initialAmountF)
        }

        let maxAmountF = getValues('maxAMount')


        setMessage({
            title: "Editar valor inicial",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                setMessage({})

                /* GetRoutesByValidity({
                    page: 1,
                    perPage: 20,
                    consecutiveSap: null,
                    consecutiveAurora: row.id,
                }).then(res => {
                    let mountFind = JSON.stringify(res.data.array[0]?.amounts.map((e: any, index: number) => {
                        return ({
                            id: e.id,
                            key: e.id,
                            amountCdpId: e.cdpCode,
                            initialAmount: e.amount,
                            isActive: e.isActive,
                        })
                    }));
                }) */



                const { newAmount, maxAMount, mountSelected } = watch()
                const linksCdp = getValues('linksRp')
                const initialAmount = (linksCdp.find((el: any) => el.key == row.id)).initialAmount
                const initialAmountF = parseFloat(initialAmount.toString())

                if (mountSelected == null) {
                    setValueRegister('mountSelected', row.id)
                    setValueRegister('maxAMount', initialAmountF)
                } else {
                    mountSelected != row.id && setValueRegister('maxAMount', initialAmountF)
                }

                let maxAmountF = getValues('maxAMount')

                console.log({ initialAmountF, new: parseFloat(newAmount.toString()) })
                //let initialAmountFixed = parseFloat(Number(initialAmount).toFixed(2))
                if (newAmount > 0 && parseFloat(newAmount.toString()) <= maxAMount) {
                    setConfirmChangeAmountSt({ id: row.id, amount: Number(newAmount).toFixed(2) })
                } else {
                    setConfirmChangeAmountSt({ id: row.id, amount: null })
                    setMessage({
                        title: `Valor no valido`,
                        description: 'El monto modificado debe ser mayor que cero y menor o igual que el monto inicial',
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
            },
            onClose() {
                setMessage({})
            },
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
                            //onBlur={(e) => setMountEditSt({ id: row.id, amount: Object(e).target.value })}
                            />
                        )} />
                </div>
            </div>,
            background: true
        })
    }

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "cdpPosition",
            header: "Consecutivo CDP SAP"
        },
        {
            fieldName: "cdpPosition",
            header: "Posicion CDP",
        },
        {
            fieldName: "budgetRoute.projectVinculation.type",
            header: "Proyecto",
        },
        {
            fieldName: "budgetRoute.fund.number",
            header: "Fondo",
        },
        {
            fieldName: "budgetRoute.pospreSapiencia.number",
            header: "Pospre",
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
                        <Checkbox inputId={row.id} name="row" value={row} onChange={onAmountChange} checked={selectedAmounts?.some((item) => item.id == row.id)} />
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
        if (findAmountsSt.sab > 0) {
            GetRoutesByValidity({
                page: 1,
                perPage: 20,
                consecutiveSap: findAmountsSt.sab,
                consecutiveAurora: findAmountsSt?.aurora,
            }).then(res => {
                res.data?.array && setDataAmounts(res.data.array[0]?.amounts?.filter(e => e.isActive == true))
                setSelectedAmounts(res.data.array[0]?.amounts.filter(e => e.isActive == true))
            })
        }
    }, [findAmountsSt])

    const { consecutiveCdpAurora } = watch()

    useEffect(() => {
        if (consecutiveCdpAurora) {
            if (consecutiveCdpAurora) {
                GetRoutesByValidity({
                    page: 1,
                    perPage: 1,
                    consecutiveSap: null,
                    consecutiveAurora: consecutiveCdpAurora,
                }).then(res => {
                    setValueRegister('consecutiveCdpSap', res.data.array[0]?.sapConsecutive)
                })
            }
        }
    }, [consecutiveCdpAurora])





    const [isChangeAmount, setIsChangeAmount] = useState(false)
    const [newDataAmountSt, setDataNewAmountSt] = useState([])
    useEffect(() => {
        let amountRoute = dataAmounts?.map((e: any, index: number) => {
            if (confirmChangeAmountSt?.amount) {
                setIsChangeAmount(!isChangeAmount)
            }
            setValueRegister('newAmount', null)
            return ({
                id: e.id,
                key: e.id,
                amountCdpId: e.cdpCode,
                initialAmount: confirmChangeAmountSt?.amount && confirmChangeAmountSt.id == e.id ? confirmChangeAmountSt.amount : e.amount,
                isActive: e.isActive,
                reasonCancellation: "",
                rpId: null,
                position: index + 1
            })
        })
        if (confirmChangeAmountSt?.amount) {
            const newAmounts = dataAmounts.map(e => {
                let amountModify = amountRoute.find(el => el.id == e.id)
                e.amount = amountModify.initialAmount
                return e;
            })
            setDataNewAmountSt(newAmounts)
        }
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


    const onAmountChange = (e) => {
        let _selectedAmounts = [...selectedAmounts];
        if (e.checked) {
            _selectedAmounts.push(e.value);
        } else {
            _selectedAmounts = _selectedAmounts.filter(r => r.id !== e.value.id);
        }
        setSelectedAmounts(_selectedAmounts)
    };

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

    useEffect(() => {
        const subscription = watch(() => { });
        return () => subscription.unsubscribe();
    }, [watch]);

    const { supplierType, componentId, dependencyId, linksRp, dateValidity, documentDate } = watch()


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


    const onSubmitRP = handleSubmit(async (data: IBudgetRecord) => {
        data.contractualObject = contractualObjectSt
        data.contractorDocument = contractorDocumentSt
        showModal({
            title: "Guardar",
            description: "¿Está segur@ de guardar la información?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({})
                messageConfirmSave(data)
                setIsLoading(true)
            },
            onCancel: () => {
                setMessage({})
                setIsLoading(false)
            },
            onClose: () => {
                setMessage({})
                setIsLoading(false)
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
            OkTitle: "Aceptar",
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


    useEffect(() => {

        if (
            contractorDocumentSt.length > 0 &&
            contractualObjectSt.length > 0 &&
            supplierType != "" &&
            componentId != null &&
            dependencyId != null &&
            linksRp.length > 0 &&
            dateValidity != "" &&
            documentDate != ""
        ) {
            setIsAllowSave(true)
        }
    }, [
        contractorDocumentSt,
        contractualObjectSt,
        supplierType,
        componentId,
        dependencyId,
        linksRp,
        dateValidity,
        documentDate
    ])


    return {
        watch,
        control,
        errors,
        register,
        onSubmitRP,
        setMessage,
        getValues,
        isAllowSave,
        isVisibleTable,
        tableColumns,
        tableActions,
        tableComponentRef,
        isLoading,
        dataAmounts,
        componentsData,
        dependeciesData,
        activityObjectContractData,
        contractorsData,
        creditorsData,
        setContractorDocumentSt,
        setContractualObjectSt,
        setFindAmountsSt,
        newDataAmountSt
    };


}

