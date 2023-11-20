import { useForm } from "react-hook-form";
//import { IBudgetRecordEditBasic } from "../interface/budget-record";
import { useContext, useEffect, useState } from "react";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { IBudgetRecord } from "../interface/budget-record";
import { usePayrollExternalServices } from "./payroll-external-services.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetRecordEditCrudValidator } from "../../../common/schemas/budget-record-edit-validator";


export function useBudgeRecordEdit(id) {

    const resolver = useYupValidationResolver(budgetRecordEditCrudValidator);
    const navigate = useNavigate();
    const { GetRpByFilters, GetAllComponents, UpdateDataBasicRp, GetAllActivityObjectContract } = useBudgetRecordServices();
    const { GetAllDependencies, GetContractorsByDocuments } = usePayrollExternalServices()
    const { setMessage, authorization } = useContext(AppContext);

    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);

    const [isAllowSave, setIsAllowSave] = useState(false)
    const [isUploadData, setIsUploadData] = useState(false)
    const [activityObjectContractData, setActivityObjectContractData] = useState<IDropdownProps[]>([]);

    const [contractorListSt, setContractorListSt] = useState([])
    useEffect(() => {
        GetAllComponents().then(res => {
            const componentes = res.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setComponentsData(componentes)
        })

        GetAllDependencies().then(res => {
            const dependencies = Object(res).data.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setDependeciesData(dependencies)
        })

        GetContractorsByDocuments({}).then(res => {
            const contractorList = res.data.data.map((e, index) => ({
                id: e.numberDocument,
                name: e?.firstName + " " +
                    e?.secondName + " " +
                    e?.surname + " " +
                    e?.secondSurname, value: e.numberDocument
            }))

            setContractorListSt(contractorList)
        })

        GetAllActivityObjectContract().then(res => {
            const activities = Object(res).data?.map(e => ({ id: e.id, name: e.description, value: e.description }))
            setActivityObjectContractData(activities)
        })

    }, [])


    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues,
        reset
    } = useForm<IBudgetRecord>({
        defaultValues: {
            id: id,
            supplierName: '',
            contractorDocument: '',
            documentDate: '',
            dateValidity: '',
            dependencyId: null,
            contractualObject: '',
            componentId: null,
            consecutiveSap: null,
            consecutiveCdpAurora: null,
            contractNumber: '',
            responsibleDocument: '',
            supervisorDocument: '',
        },
        mode: 'onChange',
        resolver,
    });

    const formData = watch()

    useEffect(() => {
        if (!isUploadData) return;
        setIsAllowSave(true)
    }, [formData])


    function pad(num) {
        return num < 10 ? '0' + num : num;
    }


    const formatDate = (dateUTC: Date) => {
        let year = new Date(dateUTC).getUTCFullYear();
        let month = new Date(dateUTC).getUTCMonth() + 1; // Los meses en JavaScript van de 0 a 11
        let day = new Date(dateUTC).getUTCDate() + 1;
        let fechaFormateada = year + '-' + pad(month) + '-' + pad(day)
        return fechaFormateada
    }

    useEffect(() => {
        if (id != "") {
            GetRpByFilters({
                consecutiveRpAurora: Number(id)
            }).then(res => {
                if (res.operation.code == 'OK') {
                    setValueRegister('id', res.data[0].id)
                    setValueRegister('supplierName', res.data[0].supplierType == 'Acreedor' ? Object(res).data[0].creditor.name : (contractorListSt.find(e=>e.value==res.data[0].contractorDocument)).name)
                    setValueRegister('contractorDocument', res.data[0].contractorDocument)
                    setValueRegister('documentDate', formatDate(res.data[0].documentDate))
                    setValueRegister('dateValidity', formatDate(res.data[0].dateValidity))
                    setValueRegister('dependencyId', res.data[0].dependencyId)
                    setValueRegister('contractualObject', res.data[0].contractualObject)
                    setValueRegister('componentId', res.data[0].componentId)
                    setValueRegister('consecutiveSap', res.data[0].consecutiveSap)
                    setValueRegister('consecutiveCdpAurora', res.data[0].id)
                    setValueRegister('contractNumber', res.data[0].contractNumber)
                    setValueRegister('responsibleDocument', res.data[0].responsibleDocument)
                    setValueRegister('supervisorDocument', res.data[0].supervisorDocument)

                    setIsUploadData(true)
                }
            })
        }
    }, [id, contractorListSt])

    const onSubmitEditRp = handleSubmit(async (data: IBudgetRecord) => {
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
            },
            onCancel: () => {
                setMessage({})
            },
            onClose: () => {
                setMessage({})
            },
            background: true
        })

    })

    const messageConfirmSave = (data: any) => {
        UpdateDataBasicRp(data).then(res => {
            Object(res).operation.code == 'OK'
                ? showModal({
                    title: "Guardado",
                    description: "¡Guardado exitosamente!",
                    onOk: (() => {
                        setMessage({})
                        navigate('../')
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
        setMessage,
        getValues,
        reset,
        onSubmitEditRp,
        componentsData,
        dependeciesData,
        isAllowSave,
        contractorListSt,
        activityObjectContractData
    };

}