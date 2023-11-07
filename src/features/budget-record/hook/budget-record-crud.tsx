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



export function useBudgeRecordCrud() {

    /* const resolver = useYupValidationResolver(budgetRecordCrudValidator); */
    const { CreateBudgetRecord, GetAllComponents } = useBudgetRecordServices();
    const { GetRoutesByValidity } = useCdpServices()
    const { GetCreditorsByFilters } = useCreditorsServices()

    const { setMessage, authorization } = useContext(AppContext);

    const navigate = useNavigate();

    const tableComponentRef = useRef(null);
    const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)
    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [contractorsData, setContractorsData] = useState<IDropdownProps[]>([]);
    const [creditorsData, setCreditorsData] = useState<IDropdownProps[]>([]);

    useEffect(() => {
        GetAllComponents().then(res => {
            const componentes = res.data.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setComponentsData(componentes)
        })

        setDependeciesData(
            [
                { id: 1, name: "Dependencia1", value: 1 },
                { id: 2, name: "Dependencia2", value: 2 },
                { id: 3, name: "Dependencia3", value: 3 },
                { id: 4, name: "Dependencia4", value: 4 }
            ]
        )
    }, [])

    const showModalChangeAmount = (id: number) => {
        setMessage({
            title: "Editar valor inicial",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                setMessage({})
            },
            onClose() {
                setMessage({})
            },
            description: <div style={{ width: '100%' }}>
                <label>Digite el valor inicial</label>
                <div>
                    <InputComponent
                        idInput="exercise"
                        className="input-basic medium"
                        typeInput="number"
                        register={register}
                        label="Valor"
                        classNameLabel="text-black big bold text-required"
                        direction={EDirection.column}
                        errors={errors}
                    />
                </div>
            </div>,
            background: true
        })
    }

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "budgetRoute.fund.number",
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
                        <Checkbox inputId={row.id} name="row" value={row} onChange={onCategoryChange} checked={dataAmounts.some((item) => item.id == row.id)} />
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                showModalChangeAmount(row.id)
            },
        }
    ];


    const [dataAmounts, setDataAmounts] = useState<any[]>([])
    const [selectedAmounts, setSelectedAmounts] = useState([]);

    useEffect(() => {
        GetRoutesByValidity({
            page: 1,
            perPage: 1,
            consecutiveSap: 1,
            consecutiveAurora: 1,
        }).then(res => {
            res.data?.array && setDataAmounts(res.data.array[0].amounts.filter(e=>e.isActive==true))
            res.data?.array && setSelectedAmounts(res.data.array[0].amounts.filter(e=>e.isActive==true))
        })
    }, [])


    useEffect(() => {
        let amountRoute = selectedAmounts.map(e=>{
            return ({
                id: null,
                amountCdpId: e.cdpCode,
                initialAmount: e.amount,
                isActive: e.isActive,
                reasonCancellation: "",
                rpId: 1
            })
        })
        setValueRegister('linksRp',amountRoute)        
    
    }, [selectedAmounts])



    const onCategoryChange = (e) => {
        let _selectedAmounts = [...selectedAmounts];
        //let _selectedAmounts = getValues('linksRp');
        console.log({ _selectedAmounts })
        if (e.checked){
            _selectedAmounts.push(e.value);
        }else{
            _selectedAmounts = _selectedAmounts.filter(r => r.id !== e.value.id);
        }    
        setSelectedAmounts(_selectedAmounts);
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
            documentDate: "",
            dateValidity: "",
            dependencyId: null,
            contractualObject: "",
            componentId: null,
            userCreate: "",
            userModify: "",
            dateModify: "",
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
        mode: 'onBlur',
        /* resolver, */
    });


    const [isAllowSave, setIsAllowSave] = useState(true)

    useEffect(() => {
        const subscription = watch(() => { });
        return () => subscription.unsubscribe();
    }, [watch]);


    const { supplierType, contractorDocument } = watch()

    console.log({ contractorDocument })
    useEffect(() => {
        console.log({ supplierType })
        if (!supplierType) return;
        supplierType == 'Contratista'
            ? setValueRegister('supplierName', '1')
            : (
                GetCreditorsByFilters({
                    id: null,
                    document: contractorDocument,
                    page: 1,
                    perPage: 1000
                }).then(res => {
                    setValueRegister('supplierName', Object(res).data.array[0].name)
                    setValueRegister('supplierId', Object(res).data.array[0].id)
                })

            )
    }, [supplierType, contractorDocument])


    const onSubmitRP = handleSubmit(async (data: IBudgetRecord) => {

        console.log({ data })
        showModal({
            title: "Guardar",
            description: "¿Está segur@ de guardar la información?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({})
                messageConfirmSave(
                    data
                    /* {
                    "supplierType": "Acreedor",
                    "supplierId": 1,
                    "contractorDocument": "34534534",
                    "documentDate": "2023-11-02",
                    "dateValidity": "2024-11-02",
                    "dependencyId": 1,
                    "contractualObject": "Este es el objeto del contrato",
                    "componentId": 1,
                    "userCreate": "Juan",
                    "userModify": "Juan",
                    "dateCreate": "2023-11-02",
                    "dateModify": "2023-11-02",
                    "linksRp": data?.linksRp.filter(e=>e.isActive==true)
                } */)
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
        CreateBudgetRecord(data)
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


    return {
        control,
        errors,
        register,
        watch,
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
        contractorsData,
        creditorsData,
    };


}

