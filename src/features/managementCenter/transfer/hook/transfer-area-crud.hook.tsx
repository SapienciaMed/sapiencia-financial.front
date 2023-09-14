
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
import DetailsSelectedProjectComponent from '../../components/details-selected-project.component';
import { IAddFund } from '../interfaces/TransferAreaCrudInterface';

export function useTransferAreaCrudPage() {

    const tableComponentRef = useRef(null);
    const resolver = useYupValidationResolver(transferAreaCrudValidator);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [ showModalDetail, setShowModalDetail ] =useState({
        show: false,
        row: [
            {
                id: '',
                title: '',
                value: '',
                idListNameProject: '',
            }
        ],
        total: 0
    })

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

    useEffect(() => {
        showModalDetail?.show && (
            setMessage({
                title: "Detalle",
                show: true,
                description: <DetailsRouteValuesComponent 
                    rows={showModalDetail.row} 
                    total={showModalDetail.total} 
                    onOk={onCloseModal} 
                    onShowModalDetail={onShowModalDetail} 
                    />,
                background: true
            })
        )
    },[showModalDetail])

    const onCloseModal = () => setMessage({});

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
                    id: row.id,
                    title: item.nameProject,
                    value: item.totalProject,
                    idListNameProject: item.id,
                }));

                const total = row.listNameProject.reduce((accumulator, project) => {
                    const total = parseFloat(project.totalProject.replace(/\./g, '').replace(',', '.'));
                    return accumulator + total;
                }, 0);

                setShowModalDetail({ show: true, row: rows, total })
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

    const onShowModalDetail = (title: string, idListNameProject: string, id: string) => {
        setMessage({
            title,
            show: true,
            titleBack: 'Atrás',
            onOk: () => {
                setMessage({})
            },
            onBack: () => {
                setMessage({})
                setShowModalDetail({ show: true, row: showModalDetail.row, total: showModalDetail.total })
            },
            description: <DetailsSelectedProjectComponent option='' idListNameProject={idListNameProject} onOk={onCloseModal} id={id}/>,
            background: true
        })
    }

    const onCancel = () => {
        setMessage({
            title: "Cancelar",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            description: '¿Estás segur@ que desea cancelar la operación?',
            onOk: () => {
                setMessage({})
                navigate(-1);
            },
            background: true
        })
    };

    return{
        errors,
        control,
        isBtnDisable,
        tableColumns,
        tableActions,
        tableComponentRef,
        onCancel,
        onSubmit,
        navigate,
        register,
    }
    
}

//TODO: eliminar
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
    origen: IAddFund[],
    destino: IAddFund[],
}

export const mockData: IPagingData<mockProp> = {
    array: [
        {
            id: "1",
            project: "2",
            totalTransfer: "11.500.000.00",
            userCreate: "797940",
            listNameProject: [
                {
                    id: '1-list',
                    nameProject: 'Aprovechamiento de las ciudades universitarias',
                    totalProject: '20.500.000.00',
                    origen: [
                        {
                            managerCenter: '91500000',
                            projectId: '9200115',
                            functionalArea: '22020700.3618.99',
                            funds: '911070123',
                            posPre: '91102060060602',
                            value: '10.250.000.00',
                        },
                        {
                            managerCenter: '2',
                            projectId: '2',
                            functionalArea: '2.3618.99',
                            funds: '2',
                            posPre: '2',
                            value: '10.250.000.00',
                        }
                    ],
                    destino: [
                        {
                            managerCenter: '91500055',
                            projectId: '9200854',
                            functionalArea: '22020700.3618.99',
                            funds: '911070123',
                            posPre: '91102060060602',
                            value: '51.500.000.00',
                        }
                    ]
                    
                },
                {
                    id: '2-list',
                    nameProject: 'Aplicación del acceso y la permanencia en la educación postsecundaria',
                    totalProject: '94.500.000.00',
                    origen: [
                        {
                            managerCenter: '91',
                            projectId: '92',
                            functionalArea: '2',
                            funds: '9',
                            posPre: '911',
                            value: '80.500.000.00',
                        }
                    ],
                    destino: [
                        {
                            managerCenter: '91500000',
                            projectId: '9200115',
                            functionalArea: '22020700.3618.99',
                            funds: '911070123',
                            posPre: '91102060060602',
                            value: '20.500.000.00',
                        }
                    ]
                },
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