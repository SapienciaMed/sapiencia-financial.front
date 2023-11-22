import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { budgetRoutesValidator } from "../../../common/schemas";
import { IBudgetsRoutesFilters, IBudgetsRoutes } from "../interfaces/BudgetRoutesInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { AppContext } from "../../../common/contexts/app.context";
import DetailsComponent from "../../../common/components/details.component";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";
import { IProjectAdditionList } from "../../functionality/interfaces/AdditionsTransfersInterfaces";

export function useBudgetRoutesData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetProjectsList } = useAdditionsTransfersService()
    const { setMessage, validateActionAccess } = useContext(AppContext);
    const resolver = useYupValidationResolver(budgetRoutesValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<IBudgetsRoutesFilters>({ resolver });

    const [linkedProjects, setLinkedProjects] = useState<IProjectAdditionList[]>(null);
    const [showTable, setShowTable] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)

    const inputValue =  watch(['idProjectVinculation'])

    const tableColumns: ITableElement<IBudgetsRoutes>[] = [
        {
            fieldName: "idProjectVinculation",
            header: "ID Proyecto",
            renderCell: (row) => {
                const projectVinculate = linkedProjects.find((item) => item.id === row.idProjectVinculation);
                return <>{projectVinculate.projectId}</>
            }
        },
        {
            fieldName: "idProjectVinculation",
            header: "Nombre Proyecto",
            renderCell: (row) => {
                const projectVinculate = linkedProjects.find((item) => item.id === row.idProjectVinculation);
                return <>{projectVinculate.conceptProject}</>
            }
        },
        {
            fieldName: "fund.number",
            header: "Fondo"
        },
        {
            fieldName: "budget.number",
            header: "Pospre origen"
        },
        {
            fieldName: "fuctionalArea",
            header: "Área funcional",
            renderCell: (row) => {
                const projectVinculate = linkedProjects.find((item) => item.id === row.idProjectVinculation);
                return <>{projectVinculate.areaFuntional.number }</>

            }
            
        }
    ];
    const tableActions: ITableAction<IBudgetsRoutes>[] = [
        {
            icon: "Detail",
            hide:!validateActionAccess('RUTA_PRESUPUESTAL_VISUALIZAR'),
            onClick: (row) => {
                const projectVinculate = linkedProjects.find((item) => item.id === row.idProjectVinculation);
             
                const rows = [
                    {
                        title: "ID proyecto",
                        value: `${projectVinculate.projectId}`
                    },
                    {
                        title: "Nombre proyecto",
                        value: `${projectVinculate?.conceptProject}`
                    },
                    {
                        title: "Centro gestor",
                        value: `${row.managementCenter}`
                    },
                    {
                        title: "Div",
                        value: `${row.div}`
                    },
                    {
                        title: "Pospre Origen",
                        value: `${row.budget.number}`
                    },
                    {
                        title: "Pospre sapiencia",
                        value: `${row.pospreSapiencia.number}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.fund.number}`
                    },
                    {
                        title: "Área funcional",
                        value: `${projectVinculate.areaFuntional.number}`
                    }
                ]
                setMessage({
                    title: "Detalle Ruta presupuestal",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        },
        {
            icon: "Edit",
            hide:!validateActionAccess('RUTA_PRESUPUESTAL_EDITAR'),
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        },
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IBudgetsRoutesFilters) => {
        if(linkedProjects) {
            setShowTable(true)
            loadTableData(data)
        };
    });

    useEffect(() => {
        GetProjectsList().then(responseProjectList => {
            if (responseProjectList.operation.code === EResponseCodes.OK) {
                setLinkedProjects(responseProjectList.data);
            }
        })
    }, [])

    useEffect(() => {
        if(linkedProjects) loadTableData();
    }, [linkedProjects])

    useEffect(() => {
        setIsBtnDisable(inputValue.some(value => value != '' && value != undefined))
    },[inputValue])

    return { navigate, tableComponentRef, control, register, reset, isBtnDisable, showTable, setShowTable, errors, onSubmit, tableColumns, tableActions, validateActionAccess }
}