import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";
import { IBudgets } from "../interfaces/Budgets";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useEntitiesService } from "./entities-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { useVinculationService } from "./vinculation-mga-service.hook";
import { IActivityMGA } from "../interfaces/VinculationMGAInterfaces";
import { AppContext } from "../../../common/contexts/app.context";

interface IFilterBudgets {
    number: string
}

export function useBudgetsData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetEntities } = useEntitiesService();
    const resolver = useYupValidationResolver(fundsValidator);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
    const [isVisibleTable, setIsVisibleTable] = useState<Boolean>(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)
    const {GetMgaLinkage} = useVinculationService()
    const [ mgaLinkageData,setMgaLinkageData] = useState<IActivityMGA[]>(null)
    const { setMessage } = useContext(AppContext);
    
    const {
    handleSubmit,
    register,
    formState: { errors },
    control: controlRegister,
    reset,
    watch
  } = useForm<IFilterBudgets>({ resolver });

    const inputValue =  watch(['number'])

    const tableColumns: ITableElement<IBudgets>[] = [
        {
            fieldName: "number",
            header: "Posición presupuestaria"
        },
        {
            fieldName: "denomination",
            header: "Denominacion"
        },
        {
            fieldName: "",
            header: "Vinculación MGA",
            renderCell: (row) => {
                console.log("🚀 row:", row)
                  
                let algo: IActivityMGA[] = []
                // if(setMgaLinkageData) algo = mgaLinkageData.filter(object => object.id === )
                console.log("🚀  mgaLinkageData:", mgaLinkageData)
                return (
                    <>
                        {
                        mgaLinkageData ? <> </> : <> </>
                        }
                    </>
                )
            }

        },
        {
            fieldName: "",
            header: "Pospre Sapiencia"
        },
        
        
    ];

    const tableActions: ITableAction<IBudgets>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                navigate(`./view/${row.id}`);
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        },
        {
            icon: "Link",
            onClick: (row) => {
                navigate(`./vinculacion/${row.id}`);
            }
        }
    ];

    function mgaLinkage (id: number) {
        GetMgaLinkage(String(id), '1', '10').then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IActivityMGA = response.data;
                setMgaLinkageData([data])
            }else{
                setMessage({
                    title: "Validacion de datos",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    background: true
                })
            }
        }).catch(err => console.log(err))

    }

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IFilterBudgets) => {
        setIsVisibleTable(true);
        loadTableData(data);
    });

    useEffect(() => {
        loadTableData();
        // GetEntities().then(response => {
        //     if (response.operation.code === EResponseCodes.OK) {
        //         const entities: IEntities[] = response.data;
        //         const arrayEntities: IDropdownProps[] = entities.map((entity) => {
        //             return { name: entity.name, value: entity.id };
        //         });
        //         setEntitiesData(arrayEntities);
        //     }
        // }).catch(() => { });
    }, [])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    
    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        isBtnDisable,
        isVisibleTable,
        onSubmit,
        register,
        navigate,
        errors,
        reset,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        controlRegister,
        setIsVisibleTable
    }
} 