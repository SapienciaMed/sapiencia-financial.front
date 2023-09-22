
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
import { useTypesTranfersService } from './types-transfers-service.hook';
import { EResponseCodes } from '../../../../common/constants/api.enum';
import { cleanTransferContext } from '../../../../common/utils';

export function useTransferAreaCrudPage() {

    const tableComponentRef = useRef(null);
    const resolver = useYupValidationResolver(transferAreaCrudValidator);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const [isAddBtnDisable, setIsAddBtnDisable] = useState<boolean>(false)
    const [validate, setValidate] = useState(true)
    const [ showModalDetail, setShowModalDetail ] =useState({
        show: false,
        row: [ { data: {
            id: '',
            title: '',
            value: '',
        } }],
        total: 0
    })
    const [totalTransfer, setTotalTransfer] = useState<string>('')

    const navigate = useNavigate();
    const { setMessage, setHeadTransferData, setAddTransferData, setDetailTransferData, authorization, addTransferData, detailTransferData } = useContext(AppContext);
    const { createTransfer } = useTypesTranfersService()

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        watch,
        setValue,
    } = useForm<IBasicTransfers>({resolver});

    const inputValue =  watch(['actAdminDistrict', 'actAdminSapiencia', 'observations'])
    const inputValues = watch()
        
    useEffect(() => {
        setIsBtnDisable(inputValue.every(value => value != '' && value != undefined) && addTransferData?.array?.length > 0 )
    },[inputValue])

    useEffect(() => {
       if (addTransferData?.array?.length > 0 && inputValue.some(value => value != '' && value != undefined)) {
            setValidate(addTransferData?.array.some(item => {
                return Object.entries(inputValues).every(([key, value]) => item.headTransfer[key] === value);
            }))
       }
    },[inputValues])

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
                setValue('actAdminDistrict', item.headTransfer.actAdminDistrict)
                setValue('actAdminSapiencia', item.headTransfer.actAdminSapiencia)
                setValue('observations', item.headTransfer.observations)
            })  
        }else{
            setIsAddBtnDisable(false)
        }
    },[addTransferData])

    const onCloseModal = () => setMessage({});

    const onSubmit = handleSubmit(async (data: IBasicTransfers) => {
        addTransferData?.array?.length > 0 && 
            setMessage({
                title: "Trasladar",
                description: "¿Está segur@ que desea realizar el traslado?",
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onOk: () => {
                    setMessage({});
                    if (!validate) {
                        const addTransfer = addTransferData?.array.map(us => ({
                          ...us,
                          headTransfer: {
                            ...us.headTransfer,
                            actAdminDistrict: data.actAdminDistrict,
                            actAdminSapiencia: data.actAdminSapiencia,
                            observations: data.observations,
                          }
                        }));
                      
                        handleTransfer(addTransfer[0]);
                      } else {
                        handleTransfer(addTransferData?.array[0]);
                      }
                   
                },
            });
    }); 

    const handleTransfer = (transferData) => {
        createTransfer(transferData).then(response => {
          if (response.operation.code === EResponseCodes.OK) {
            setMessage({
              title: "Trasladar",
              description: "¡Se han realizado los traslados correctamente en el sistema!",
              show: true,
              OkTitle: "Aceptar",
              onOk: () => {
                cleanTransferContext({ setAddTransferData, setDetailTransferData })
                setMessage({});
                navigate(-1);
              },
            });
          }
        }).catch((error) => {
          setMessage({
            title: "Trasladar",
            description: error,
            show: true,
            OkTitle: "Aceptar",
            onOk: () => {
              setMessage({});
            },
          });
        });
    };
      

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
                    return accumulatedSum + item.data?.filter( data => data.type == 'Origen').reduce((projectSum, proyecto) => {
                        const totalProject = proyecto?.value;
                        return projectSum + totalProject;
                    }, 0);
                }, 0);
                setTotalTransfer(total_transfer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
                return <>$ { total_transfer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }</>
            }
        },
    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Detail",
            onClick: (row) => {

                const rows = row?.transferMovesGroups.map((item) => {
                    const totalProjectSum = item.data.filter(item => item.type === "Origen").reduce((acc, item) => acc + item.value, 0);
                    return {
                        data: {
                            id: item.id,
                            title: item.data[0].nameProject,
                            value: totalProjectSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ,
                        },
                    };
                });

                const total_transfer =  row?.transferMovesGroups.reduce((accumulatedSum, item) => {
                    return accumulatedSum + item.data?.filter( data => data.type == 'Origen').reduce((projectSum, proyecto) => {
                        const totalProject = proyecto?.value;
                        return projectSum + totalProject;
                    }, 0);
                }, 0);

                setShowModalDetail({ show: true, row: rows, total: total_transfer })
             },
        },
        {
            icon: "Delete",
            onClick: (row) => { 
                setMessage({
                    title: "Eliminar traslado",
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    description: '¿Estás segur@ que desea eliminar el traslado?',
                    onOk: () => {
                        cleanTransferContext({ setAddTransferData, setDetailTransferData })
                        setMessage({})
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
            description: <DetailsSelectedProjectComponent option='' onOk={onCloseModal} id={id} />,
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
                cleanTransferContext({ setAddTransferData, setDetailTransferData })
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

        return `${year}-${month<10 ? '0'+month :  month}-${ day<10 ? '0'+day :  day}`
    }

    const onAddvalues = async (data: IBasicTransfers) => {
        setHeadTransferData({
            actAdminDistrict: data.actAdminDistrict,
            actAdminSapiencia: data.actAdminSapiencia,
            observations: data.observations,
            dateCreate: currentDate(),
            dateModify: '2023-08-31',
            userCreate: authorization?.user?.numberDocument || '',
            userModify: authorization?.user?.numberDocument || '',
        })
        navigate('./anadir-traslado')
    };
    
    const handleFormSubmit = () => handleSubmit(onAddvalues)();

    return{
        errors,
        control,
        isBtnDisable,
        tableColumns,
        tableActions,
        detailTransferData,
        tableComponentRef,
        isAddBtnDisable,
        totalTransfer,
        onCancel,
        onSubmit,
        navigate,
        register,
        handleFormSubmit
    }
    
}