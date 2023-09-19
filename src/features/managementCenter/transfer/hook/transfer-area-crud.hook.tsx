
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IBasicTransfers } from '../interfaces/TypesTranfersInterfaces';
import { useNavigate } from 'react-router-dom';
import useYupValidationResolver from '../../../../common/hooks/form-validator.hook';
import { transferAreaCrudValidator } from '../../../../common/schemas/transfer-schema';
import { AppContext } from '../../../../common/contexts/app.context';
import DetailsRouteValuesComponent from '../../components/details-route-values.component';
import { ITableAction, ITableElement } from '../../../../common/interfaces/table.interfaces';
import DetailsSelectedProjectComponent from '../../components/details-selected-project.component';
import { IobjectAddTransfer } from '../../../../common/interfaces/global.interface';

export function useTransferAreaCrudPage() {

    const tableComponentRef = useRef(null);
    const resolver = useYupValidationResolver(transferAreaCrudValidator);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [isAddBtnDisable, setIsAddBtnDisable] = useState<boolean>(false)
    const [ showModalDetail, setShowModalDetail ] =useState({
        show: false,
        row: [ { data: {
            id: '',
            title: '',
            value: '',
        } }],
        total: 0
    })

    const navigate = useNavigate();
    const { setMessage, setHeadTransferData, setAddTransferData, authorization, addTransferData } = useContext(AppContext);

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm<IBasicTransfers>({resolver});

    const inputValue =  watch(['adminDistrict', 'adminSapiencia', 'remarks'])

    useEffect(() => {
        setIsBtnDisable(inputValue.every(value => value != '' && value != undefined) && addTransferData?.array?.length > 0 )
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

    useEffect(() => {
        
        if(addTransferData?.array?.length > 0 ){
            setIsAddBtnDisable(addTransferData?.array?.length > 0);
            addTransferData.array.map(item => {
                setValue('adminDistrict', item.headTransfer.actAdminDistrict)
                setValue('adminSapiencia', item.headTransfer.actAdminSapiencia)
                setValue('remarks', item.headTransfer.observations)
            })  
        }
    },[addTransferData])

    const onCloseModal = () => setMessage({});

    const onSubmit = handleSubmit(async (data: IBasicTransfers) => {}); // agregar condicion para que sea llamado del boton "Trasladar"

    const tableColumns: ITableElement<IobjectAddTransfer>[] = [
        {
            fieldName: "project",
            header: "Proyecto",
            renderCell: (row) => <>{row?.transferMovesGroups?.length}</>
            
        },
        {
            fieldName: "totalTransfer",
            header: "Total a trasladar",
            renderCell: (row) => {
                const total_transfer = row?.transferMovesGroups.reduce((accumulatedSum, item) => {
                    return accumulatedSum + item.data?.reduce((projectSum, proyecto) => {
                        const totalProject = proyecto?.value;
                        return projectSum + totalProject;
                    }, 0);
                }, 0);
                return <>$ { total_transfer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }</>
            }
        },
    ];

    const tableActions: ITableAction<any>[] = [ // any: cambiarlo por el tipado del addTransferData
        {
            icon: "Detail",
            onClick: (row) => {

                const rows = row?.transferMovesGroups.map((item) => {
                    const totalProjectSum = item.data.reduce( (sum, proyecto) => sum + proyecto?.value, 0 );
                    return {
                        data: {
                            id: item.id,
                            title: item.data[0].nameProject,
                            value: totalProjectSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ,
                        },
                    };
                });
                const total_transfer = row?.transferMovesGroups.reduce((accumulatedSum, item) => {
                    return accumulatedSum + item.data?.reduce((projectSum, proyecto) => {
                        const totalProject = proyecto?.value;
                        return projectSum + totalProject;
                    }, 0);
                }, 0);

                setShowModalDetail({ show: true, row: rows, total: total_transfer })
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

    const onShowModalDetail = (title: string, id: string, totalTransfer: string) => {
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
            description: <DetailsSelectedProjectComponent option='' onOk={onCloseModal} id={id} total={totalTransfer} />,
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
                setAddTransferData({
                    array: [],
                    meta: {
                      total: 0,
                    }
                  })
                setHeadTransferData({
                    actAdminDistrict: '',
                    actAdminSapiencia: '',
                    observations: '',
                    dateCreate: '',
                    dateModify: '',
                    userCreate: '',
                    userModify: '',
                })
                setMessage({})
                navigate(-1);
            },
            background: true
        })
    };

    const currentDate = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}-${month}-${year}`
    }

    const onAddvalues = async (data: IBasicTransfers) => {
        setHeadTransferData({
            actAdminDistrict: data.adminDistrict,
            actAdminSapiencia: data.adminSapiencia,
            observations: data.remarks,
            dateCreate: currentDate(),
            dateModify: '2023-08-31',
            userCreate: authorization?.user?.numberDocument || '',
            userModify: authorization?.user?.numberDocument || '',
        })
        navigate('./anadir-fondos')
    };
    
    const handleFormSubmit = () => handleSubmit(onAddvalues)();

    return{
        errors,
        control,
        isBtnDisable,
        tableColumns,
        tableActions,
        addTransferData,
        tableComponentRef,
        isAddBtnDisable,
        onCancel,
        onSubmit,
        navigate,
        register,
        handleFormSubmit
    }
    
}