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



export function useBudgeRecordCrud() {

    /* const resolver = useYupValidationResolver(budgetRecordCrudValidator); */
    const { CreateBudgetRecord } = useBudgetRecordServices();
    const { GetRoutesByValidity } = useCdpServices()

    const { setMessage, authorization } = useContext(AppContext);

    const navigate = useNavigate();

    const tableComponentRef = useRef(null);
    const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)

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
                        <Checkbox inputId={row.id} name="category" value={row} onChange={onCategoryChange} checked={dataAmounts.some((item) => item.id === row.id)} />
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
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        GetRoutesByValidity({
            page: 1,
            perPage: 1,
            consecutiveSap: 1,
            consecutiveAurora: 1,
        }).then(res => {
            setDataAmounts(res.data.array[0].amounts)
            setSelectedCategories(res.data.array[0].amounts)
        })
    }, [])



    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];
        console.log({ _selectedCategories })
        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.id !== e.value.id);

        setSelectedCategories(_selectedCategories);
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
        mode: 'onSubmit',
        /* resolver, */
    });


    const [isAllowSave, setIsAllowSave] = useState(true)

    useEffect(() => {
        const subscription = watch(() => { });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmitRP = handleSubmit(async (data: IBudgetRecord) => {
        

        showModal({
            title: "Guardar",
            description: "¿Está segur@ de guardar la información?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({})
                messageConfirmSave({
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
                    "linksRp": [
                        {
                            "id": null,
                            "rpId": 1,
                            "amountCdpId": 1,
                            "initialAmount": 234234.23,
                            "isActive": true,
                            "reasonCancellation": ""
                        },
                        {
                            "id": null,
                            "rpId": 1,
                            "amountCdpId": 1,
                            "initialAmount": 234234.23,
                            "isActive": true,
                            "reasonCancellation": ""
                        }
                    ]
                })
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

    const messageConfirmSave = (data:any)=>{
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
        dataAmounts
    };


}

