import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { pacSearch } from '../../../common/schemas/pac';
import { IPacSearch } from '../interface/Pac';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacServices } from './pac-services.hook';
import { validateTypeResourceServices } from '../transferPac/util';
import { EResponseCodes } from '../../../common/constants/api.enum';
import { AppContext } from '../../../common/contexts/app.context';
import { IArrayDataSelectPac } from '../transferPac/interfaces/TypeTransferPac';
export function usePacData() {

    const tableComponentRef = useRef(null);
    const { GetRoutesByValidity } = usePacServices()
    const { setMessage, authorization } = useContext(AppContext);
    const resolver = useYupValidationResolver(pacSearch);
    const [ isBtnDisable, setIsBtnDisable ] = useState<boolean>(false)
    const [ areTheFieldsFull, setAreTheFieldsFull ] = useState<boolean>(false)
    const [showTable, setShowTable] = useState(false);
    const navigate = useNavigate();
    const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelectPac>({
        functionalArea: [],
        fundsSapiencia: [],
        pospreSapiencia: [],
    })
    const [ showSpinner, setShowSpinner ] = useState(false)
    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        reset,
        watch,
        control
    } = useForm<IPacSearch>({
        resolver,
        mode: 'all'
    })

    const inputValue =  watch(['pacType', 'validity', 'version'])
    const type = watch('pacType')

    const dataRoutesValidity = {
        page : 1,
        perPage : 10000000,
        exercise : inputValue[1],
        version: inputValue[2],
        resourceType: validateTypeResourceServices(type) || type 
    }

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
        setAreTheFieldsFull(inputValue.every(value => value != '' && value != undefined))
    },[inputValue])

    useEffect(() => {
       if (type != undefined && areTheFieldsFull) {
        GetRoutesByValidity(dataRoutesValidity).then((response) => {
            if (response.operation.code === EResponseCodes.OK) {

            }else {
                setMessage({
                    title: "Validación de datos",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                      setMessage({});
                    },
                    background: true,
                    onClose: () => {
                      setMessage({});
                    },
                });
            }
        }).catch((error) => {
           
        })
       }
    },[type])

    useEffect(() => {
        //valida si los campos de 'pacType', 'validity', 'version' estan llenos haga una peticion 
        if(areTheFieldsFull){           
            GetRoutesByValidity(dataRoutesValidity).then((response) => {
                if (response.operation.code === EResponseCodes.OK) {
                    const dinamicData = response?.data;

                }else {
                    setMessage({
                        title: "Validación de datos",
                        description: response.operation.message,
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                          setMessage({});
                        },
                        background: true,
                        onClose: () => {
                          setMessage({});
                        },
                    });
                }
            }).catch((error) => {
               
            })
        }
    },[areTheFieldsFull])


    const onSubmit = handleSubmit(async (data: IPacSearch) => {
        console.log("🚀 ~ file: pac.hook.tsx:22 ~ onSubmit ~ data:", data)
    });

    const tableColumns: any[] = [
        {
            fieldName: "proyect",
            header: "Proyecto",
        },
        {
            fieldName: "fund",
            header: "Fondo"
        },
        {
            fieldName: "pospre",
            header: "Pospre"
        },
        {
            fieldName: "pospreSapi",
            header: "Pospre Sapiencia",
        },
        {
            fieldName: "presupuestoSapi",
            header: "Presupuesto Sapiencia"
        },
        {
            fieldName: "porcentajeEje",
            header: "Porcentaje ejecución"
        },
        
    ];
    const tableActions: any[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                
            },
        }
    ];

    

    return {
        control,
        errors,
        isBtnDisable,
        showTable,
        tableComponentRef,
        tableActions,
        tableColumns,
        showSpinner,
        navigate,
        setShowTable,
        register,
        onSubmit,
        reset
    }
    
}