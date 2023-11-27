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


export function useCreditorView() {

    const navigate = useNavigate();
    const { getListByGrouper } = useGenericListService()
    const tableComponentRef = useRef(null);
    const { GetCreditorsByFilters } = useCreditorsServices();
    const { setMessage, validateActionAccess } = useContext(AppContext);
    
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
            'typeDocument': '',
            'document': '',
            'taxIdentification': '',
            'name': '',
        },
        mode: 'onChange',
        /* resolver, */
    });

    const formData = watch()

    useEffect(() => {
        if (formData.typeDocument != null && formData.typeDocument != "") {
            setIsAllowSave(true)
        } else if (formData.name != "" || formData.taxIdentification != "" || formData.document != "") {
            setIsAllowSave(true)
        } else {
            setIsAllowSave(false)
        }
    }, [formData])



    const [creditorsSt, setCreditorsSt] = useState([])
    const onSubmitCreditor = handleSubmit(async (data: ICreditor) => {
        console.log({ data })
        GetCreditorsByFilters({
            id: null,
            typeDocument: data.typeDocument,
            document: data.document,
            taxIdentification: data.taxIdentification,
            name: data.name,
            page: 1,
            perPage: 10,
        }).then(res => {
            console.log({ res })
            res.operation.code == 'OK'
                ? setCreditorsSt(Object(res).data.array)
                : setCreditorsSt([])
        })


    })


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


    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "typeDocument",
            header: "Tipo ID"
        },
        {
            fieldName: "document",
            header: "No ID",
        },
        {
            fieldName: "taxIdentification",
            header: "ID fiscal",
        },
        {
            fieldName: "name",
            header: "Nombre",
        },
        {
            fieldName: "city",
            header: "Ciudad",
        },
        {
            fieldName: "address",
            header: "Dirección",
        },
        {
            fieldName: "phone",
            header: "Teléfono",
        },
        {
            fieldName: "email",
            header: "Email",
        }
    ];

    const tableActions: ITableAction<any>[] = [
        {
            customName: 'Acciones',
            hide:!validateActionAccess('ACREEDOR_EDITAR'),
            icon: "Edit",
            onClick: (row) => {
                navigate(`/gestion-financiera/acreedor/editar/${row.id}`)
            },
        }
    ];



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
        tableComponentRef,
        tableColumns,
        tableActions,
        setCreditorsSt,
        creditorsSt,
        documentTypeList,
        validateActionAccess
    };

}