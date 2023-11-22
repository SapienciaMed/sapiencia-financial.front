import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { useCreditorsServices } from "./creditors-service.hook";
import { ICreditor } from "../interface/creditor";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { creditorCrudValidator } from "../../../common/schemas/creditor-crud-validator";


export function useCreditorCrud(id) {

    const navigate = useNavigate();
    const resolver = useYupValidationResolver(creditorCrudValidator);
    const { getListByGrouper } = useGenericListService()
    const { GetCreditorsByFilters, CreateCreditor, UpdateCreditor } = useCreditorsServices();
    const { setMessage, authorization } = useContext(AppContext);

    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);

    const [isAllowSave, setIsAllowSave] = useState(false)
    const [isUploadData, setIsUploadData] = useState(false)


    const [documentTypeList, setDocumentTypeList] = useState([])
    useEffect(() => {
        getListByGrouper('TIPOS_DOCUMENTOS').then(res => {
            const docuTypeList = Object(res).data.map(e => ({ id: e.id, name: e.itemCode, value: e.itemCode }))
            setDocumentTypeList(docuTypeList)
        })
    }, [])



    useEffect(() => {
        if (!id) return;
        setValueRegister('id', Number(id))

        GetCreditorsByFilters({
            id,
            page: 1,
            perPage: 1
        }).then(res => {
            setValueRegister('typeDocument', Object(res).data?.array[0].typeDocument);
            setValueRegister('document', Object(res).data?.array[0].document);
            setValueRegister('taxIdentification', Object(res).data?.array[0].taxIdentification);
            setValueRegister('name', Object(res).data?.array[0].name);
            setValueRegister('city', Object(res).data?.array[0].city);
            setValueRegister('address', Object(res).data?.array[0].address);
            setValueRegister('phone', Object(res).data?.array[0].phone);
            setValueRegister('email', Object(res).data?.array[0].email);
        })

    }, [id])



    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues,
        reset
    } = useForm<ICreditor>({
        defaultValues: {
            'id': null,
            'typeDocument': '',
            'document': '',
            'taxIdentification': '',
            'name': '',
            'city': '',
            'address': '',
            'phone': null,
            'email': '',
            'userModify': '',
            'userCreate': '',
            'dateCreate': '',
            'dateModify': '',
        },
        mode: 'onChange',
        resolver,
    });

    const formData = watch()

    useEffect(() => {
        if (!isUploadData) return;
        console.log("Actualizando")
        setIsAllowSave(true)
    }, [formData])


    /* useEffect(() => {
        if (id != "") {
            GetRpByFilters({
                consecutiveRpAurora: Number(id)
            }).then(res => {
                if (res.operation.code == 'OK') {
                    setValueRegister('id', res.data[0].id)
                    setValueRegister('supplierName', res.data[0].supplierType == 'Acreedor' ? Object(res).data[0].creditor.name : '')
                    setValueRegister('contractorDocument', res.data[0].contractorDocument)
                    setValueRegister('documentDate', res.data[0].documentDate)
                    setValueRegister('dateValidity', res.data[0].dateValidity)
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
    }, [id]) */

    const onSubmitCreditor = handleSubmit(async (data: ICreditor) => {
        console.log({ data })
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
        if (data.id) {
            UpdateCreditor(data).then(res => {

                Object(res).operation.code == 'OK'
                    ? showModal({
                        title: "Guardar",
                        description: "¡Se guardó exitosamente!",
                        onOk: (() => {
                            setMessage({})
                            navigate('../')
                        }),
                        OkTitle: "Aceptar",
                    })
                    : showModal({
                        title: "Falla en actualización",
                        description: "Falla en creación",
                        onOk: (() => setMessage({})),
                        OkTitle: "Aceptar",
                    })
            })
        } else {
            CreateCreditor(data).then(res => {
                console.log({ res })
                if (Object(res).operation.code == 'FAIL' &&
                    Object(res).operation.message.toString().includes('Duplicate entry')) {
                    showModal({
                        title: "Validación",
                        description: "¡El dato ya existe!",
                        onOk: (() => setMessage({})),
                        OkTitle: "Aceptar",
                    })
                } else if (Object(res).operation.code == 'FAIL' &&
                    !Object(res).operation.message.toString().includes('Duplicate entry')) {
                    showModal({
                        title: "Falla en almacenamiento",
                        description: "Falla en creación",
                        onOk: (() => setMessage({})),
                        OkTitle: "Aceptar",
                    })
                }

                Object(res).operation.code == 'OK'
                    ? showModal({
                        title: "Guardar",
                        description: "¡Se guardó exitosamente!",
                        onOk: (() => {
                            setMessage({})
                            navigate('../')
                        }),
                        OkTitle: "Aceptar",
                    })
                    : ''
            })

        }
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
        onSubmitCreditor,
        componentsData,
        dependeciesData,
        isAllowSave,
        documentTypeList
    };

}