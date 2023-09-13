
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IBasicTransfers } from '../interfaces/TypesTranfersInterfaces';
import { useNavigate } from 'react-router-dom';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { transferAreaCrudValidator } from '../../../../common/schemas/transfer-schema';
import { AppContext } from '../../../../common/contexts/app.context';
import DetailsRouteValuesComponent from '../../components/details-route-values.component';
import { ITableAction } from '../../../../common/interfaces/table.interfaces';
import { IPagingData } from '../../../../common/utils/api-response';

export function useTransferAreaCrudPage() {

    const tableComponentRef = useRef(null);
    const resolver = useYupValidationResolver(transferAreaCrudValidator);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const navigate = useNavigate();
    const { setMessage } = useContext(AppContext);

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        watch,
    } = useForm<IBasicTransfers>({resolver});

    const inputValue =  watch(['adminDistrict', 'adminSapiencia', 'remarks'])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    const onSubmit = handleSubmit(async (data: {actAdministrativeDistrict: string, actAdministrativeSapiencia: string}) => {});

    const tableColumns: any[] = [
        {
            fieldName: "project",
            header: "Proyecto",
        },
        {
            fieldName: "totalTransfer",
            header: "Total a trasladar"
        },
    ];

    const tableActions: ITableAction<mockProp>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = row.listNameProject.map(item => ({
                    title: item.nameProject,
                    value: item.totalProject,
                    id: item.id
                }));

                const total = row.listNameProject.reduce((accumulator, project) => {
                    const total = parseFloat(project.totalProject.replace(/\./g, '').replace(',', '.'));
                    return accumulator + total;
                }, 0);

                setMessage({
                    title: "Detalle",
                    show: true,
                    description: <DetailsRouteValuesComponent rows={rows} total={total} onOk={onCloseModal} onShowModalDetail={onShowModalDetail}/>,
                    background: true
                })
             },
        },
        {
            icon: "Delete",
            onClick: () => { 
                setMessage({
                    title: "Eliminar fondos",
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    description: '¿Estás segur@ que desea eliminar los fondos?',
                    onOk: () => {
                        //borrar el fondo
                    },
                    background: true
                })
            },
        }
    ];

    const onCloseModal = () => setMessage({});

    const onShowModalDetail = (title: string) => {
        setMessage({
            title,
            show: true,
            onOk: () => {
                setMessage({})
            },
            description: <>hola</>,
            background: true
        })
    }

    const mockData: IPagingData<mockProp> = {
        array: [
            {
                id: "1",
                project: "Proyecto 1",
                totalTransfer: "100.000.000",
                userCreate: "797940",
                listNameProject: [
                    {
                        id: '1',
                        nameProject: 'Aprovechamiento de las ciudades universitarias',
                        totalProject: '20.500.000.00'
                    },
                    {
                        id: '2',
                        nameProject: 'Aplicación del acceso y la permanencia en la educación postsecundaria',
                        totalProject: '94.500.000.00'
                    },
                ]
            },
            {
                id: "2",
                project: "Proyecto 2",
                totalTransfer: "200.000.000",
                userCreate: "797940",
                listNameProject: [
                    {
                        id: '1',
                        nameProject: 'Aprovechamiento de las ciudades universitarias',
                        totalProject: '20.500.000.00'
                    },
                    {
                        id: '2',
                        nameProject: 'Aplicación del acceso y la permanencia en la educación postsecundaria',
                        totalProject: '94.500.000.00'
                    }
                ]
                
            },       
        ],
        meta: {
            total: 2,
            perPage: 10,
            currentPage: 1,
            lastPage: 1,
            firstPage: 1,
        }
    }
    

    return{
        errors,
        mockData,
        control,
        isBtnDisable,
        tableColumns,
        tableActions,
        tableComponentRef,
        onSubmit,
        navigate,
        register,
    }
    
}
interface mockProp {
    id: string,
    project: string,
    totalTransfer: string,
    userCreate: string,
    listNameProject: IListNameProject[]
}

interface IListNameProject {
    id: string,
    nameProject: string,
    totalProject: string
}
