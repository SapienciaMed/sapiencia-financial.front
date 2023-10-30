import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { pacSearch } from '../../../common/schemas/pac';
import { IArrayDataSelectPacComplementary, IPacSearch } from '../interface/Pac';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacServices } from './pac-services.hook';
import { validateTypeResourceServices } from '../transferPac/util';
import { EResponseCodes } from '../../../common/constants/api.enum';
import { AppContext } from '../../../common/contexts/app.context';
import { ITableAction, ITableElement } from '../../../common/interfaces/table.interfaces';
export function usePacData() {

    const navigate = useNavigate();
    const tableComponentRef = useRef(null);
    const { GetRoutesByValidity, GetUltimateVersion } = usePacServices()
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(pacSearch);
    const [ isBtnDisable, setIsBtnDisable ] = useState<boolean>(false)
    const [ areTheFieldsFull, setAreTheFieldsFull ] = useState<boolean>(false)
    const [showTable, setShowTable] = useState(false);
    const [ showSpinner, setShowSpinner ] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [ disableEdit, setDisableEdit ] = useState(false)
    const [versionActual, setVersionActual ] = useState('')
    const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelectPacComplementary>({
        listProjects: [],
        listFunds: [],
        listPospreSapi: []
    })
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        watch,
        control,
        setValue
    } = useForm<IPacSearch>({
        resolver,
        mode: 'all'
    })

    const inputValue =  watch(['resourceType', 'exercise', 'version'])
    const type = watch('resourceType')

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
        setAreTheFieldsFull(inputValue.every(value => value != '' && value != undefined))     
    },[inputValue])

    useEffect(() => {
        setValue('exercise', String(new Date().getFullYear()))

        GetUltimateVersion().then(response => {
            if(response.operation.code === EResponseCodes.OK){
                setValue('version', response.data.version)
                setVersionActual(response.data.version)
            }
        }).catch(error => console.log(error))
    },[])

    useEffect(() => {
        //valida si los campos de 'pacType', 'validity', 'version' estan llenos haga una peticion para llenar los campos complementarios de los select(Proyecto, Fondo Sapiencia, Pospre Sapiencia) 
        if(areTheFieldsFull && type != undefined && inputValue[1].length == 4){   
            setArrayDataSelect({})   
            setShowSpinner(true)     
            QueryGetRoutesByValidity(inputValue[1], inputValue[2])
        }
    },[areTheFieldsFull, type ])

    //Cuando detecta que se dejo de escribir haga la peticion.
    const handleChangeExercise = (exercise: any) => {
        timer &&  clearTimeout(timer);  
        const newTimer =  setTimeout(() => {
            if(exercise.target.value.length == 4 && areTheFieldsFull){
                setArrayDataSelect({})   
                setShowSpinner(true)     
                QueryGetRoutesByValidity(exercise.target.value, inputValue[2])
            }           
        }, 800);

        setTimer(newTimer);
    };

    //Cuando detecta que se dejo de escribir haga la peticion.
    const handleChangeVersion = (version: any) => {
        timer &&  clearTimeout(timer);  
        const newTimer =  setTimeout(() => {
            if (areTheFieldsFull && version.target.value != undefined && version.target.value.length > 0) {
                setArrayDataSelect({})   
                setShowSpinner(true)     
                QueryGetRoutesByValidity(inputValue[1], version.target.value)            
            }
        }, 800);
            
        setTimer(newTimer);
    };

    const onSubmit = handleSubmit(async (data: IPacSearch) => {
        setDisableEdit(inputValue[2] != versionActual)
        const dataFiltered: IPacSearch = Object.keys(data).reduce((object, key) => {
            if (data[key] !== undefined) {
              object[key] = data[key];
            }
            return object;
        }, {} as IPacSearch);

        const searchCriteriaData = {
            ...dataFiltered,
            exercise: parseInt(dataFiltered?.exercise),
            resourceType: validateTypeResourceServices(dataFiltered?.resourceType) || dataFiltered?.resourceType,
            version: parseInt(dataFiltered.version),
            idBunget: arrayDataSelect?.listPospreSapi?.find(e => e?.id == dataFiltered?.idPospreSapiencia)?.projectId
        }

        setShowTable(true);
        loadTableData(searchCriteriaData);
    });

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "proyect",
            header: "Proyecto",
            renderCell(row) {
                return <>{row.dataCondensed.projectName}</>
            },
        },
        {
            fieldName: "fund",
            header: "Fondo",
            renderCell(row) {
                return <>{row.dataCondensed.numberFund}</>
            },
        },
        {
            fieldName: "pospre",
            header: "Pospre",
            renderCell(row) {
                return <>{row.dataCondensed.posPreOrig}</>
            },
        },
        {
            fieldName: "listPospreSapi",
            header: "Pospre Sapiencia",
            renderCell(row) {
                return <>{row.dataCondensed.posPreSapi}</>
            },
            
        },
        {
            fieldName: "presupuestoSapi",
            header: "Presupuesto Sapiencia",
            renderCell(row) {
                return <>{row.dataCondensed.budgetSapi}</>
            },
        },
        {
            fieldName: "porcentajeEje",
            header: "Porcentaje ejecución",
            renderCell(row) {
                return <>{row.dataCondensed.percentExecute}</>
            },
        },
        
    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                const pacId = row?.dataCondensed.pacId
                const budgetRouteId = row?.dataCondensed.routeId
                navigate(`./edit/${pacId}/${budgetRouteId}`)
            },
        }
    ];

    const QueryGetRoutesByValidity = (exercice: string, version: string) => {
        const dataRoutesValidity = {
            page: 1,
            perPage: 10000000,
            exercise: exercice,
            version: version,
            resourceType: validateTypeResourceServices(type) || type 
        }

        GetRoutesByValidity(dataRoutesValidity).then((response) => {
            setShowSpinner(false)
            if (response.operation.code === EResponseCodes.OK) {
                const dinamicData = response?.data;
                const uniqueProjects = Array.from(new Set(dinamicData.listProjects.map(project => project.projectCode))).map(projectCode => {
                    const item = dinamicData.listProjects.find(project => project.projectCode === projectCode);
                    return {
                      name: item.projectCode,
                      value: item.idVinculation,
                      id: item.idVinculation,
                    };
                });

                setArrayDataSelect(prevState => ({
                    ...prevState,
                    listProjects: uniqueProjects
                }));

                const uniqueFunds = Array.from(new Set(dinamicData.listFunds.map(fund => fund.fundCode))).map(fundCode => {
                    const item = dinamicData.listFunds.find(fund => fund.fundCode === fundCode);
                    return {
                      name: item.fundCode,
                      value: item.idFund,
                      id: item.idFund
                    };
                });
          
                setArrayDataSelect(prevState => ({
                    ...prevState,
                    listFunds: uniqueFunds
                }));

                const uniquePospreSapi = Array.from(new Set(dinamicData.listPospreSapi.map(pospreSapi => pospreSapi.idPosPreSapi))).map(idPosPreSapi => {
                    const item = dinamicData.listPospreSapi.find(pospreSapi => pospreSapi.idPosPreSapi === idPosPreSapi);
                    return {
                      name: item.numberCodeSapi,
                      value: item.idPosPreSapi,
                      id: item.idPosPreSapi,
                      projectId: item.idPosPreOrig
                    };
                });

                setArrayDataSelect(prevState => ({
                    ...prevState,
                    listPospreSapi: uniquePospreSapi
                }));


            } 
            else {
                console.log(response.operation.message)
            }
        }).catch((error) => {
            setShowSpinner(false)
            console.log(error);
            
        })
    } 

    return {
        control,
        errors,
        isBtnDisable,
        showTable,
        tableComponentRef,
        tableActions,
        tableColumns,
        showSpinner,
        arrayDataSelect,
        disableEdit,
        navigate,
        setShowTable,
        register,
        onSubmit,
        reset,
        handleChangeExercise,
        handleChangeVersion
    }
    
}