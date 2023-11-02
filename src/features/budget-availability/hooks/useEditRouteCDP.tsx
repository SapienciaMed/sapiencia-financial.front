import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCdpService } from "./cdp-service";

import { IRoutesCDP, IUpdateRoutesCDP } from "../interfaces/RouteCDPInterface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useForm } from "react-hook-form";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { IProjectAdditionList } from "../../functionality/interfaces/AdditionsTransfersInterfaces";
import { projects } from '../../../common/schemas/projects-schemas';
import { useFunctionalAreaService } from "../../functionality/hooks/functional-area-service.hook";
import { IFunctionalArea } from "../../functionality/interfaces/Functional-Area";
import { AppContext } from "../../../common/contexts/app.context";


export function useEditrouteCDP(modifiedIdcCountercredit: number, idcModifiedCredit: number, idcFixedCompleted: number) {

    //params url
    const navigate = useNavigate();
    const { id: idRoute } = useParams();
    const { setMessage } = useContext(AppContext);

    //services
    const { getRouteCDPId, getOneRpp, updateRouteCdp } = useCdpService()
    const { GetProjectsList } = useAdditionsTransfersService()
    const { GetAllFunctionalAreas } = useFunctionalAreaService()

    //states
    const [dataRoutesCDP, setDataRoutesCDP] = useState<IRoutesCDP>(null);
    const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);
    const [areaData, setAreaData] = useState<IFunctionalArea[]>([]);
    const [projectNumber, setProjectNumber] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [areaNumber, setAreaNumber] = useState("");
    const [centroGestor, setCentroGestor] = useState('91500000');
    const [idcFinalValue, setIdcFinalValue] = useState(0);
    const [balance, setBalance] = useState(0);
    const [disable, setDisable] = useState(false);


    //Form
    const {
        control,
        handleSubmit,
        register,
        watch,
        setValue,
        reset,

        formState: { errors },
    } = useForm({});


    useEffect(() => {
        if (idRoute) {
            getRouteCDPId(parseInt(idRoute)).then((response) => {
                if (response.operation.code === EResponseCodes.OK) {
                    setDataRoutesCDP(response.data);
                }
            });
        }
        GetProjectsList().then((response) => {
            if (response.operation.code === EResponseCodes.OK) {
                //console.log('datos',response.data)       
                const projectDetails = response.data.map((project) => ({
                    id: project.id,
                    functionalAreaId: project.functionalAreaId,
                    linked: project.linked,
                    type: project.type,
                    investmentProjectId: project.investmentProjectId,
                    operationProjectId: project.operationProjectId,
                    projectId: project.projectId,
                    conceptProject: project.conceptProject,
                    plannedValue: project.plannedValue,
                    assignmentValue: project.assignmentValue,

                }));
                setProjectsData(projectDetails);
            }
        });
        GetAllFunctionalAreas().then((response) => {
            if (response.operation.code === EResponseCodes.OK) {
                const areaDetails = response.data.map((area) => ({
                    id: area.id,
                    number: area.number,
                    denomination: area.denomination,
                    description: area.description
                }));

                setAreaData(areaDetails);
            }
        });
    }, [idRoute]);


    useEffect(() => {
        if (dataRoutesCDP && dataRoutesCDP.budgetRoute && projectsData.length > 0) {
            const foundProject = projectsData.find(project => project.id === dataRoutesCDP?.budgetRoute.projectVinculation.id);
            if (foundProject) {

                setProjectNumber(String(foundProject.projectId));
                setProjectName(String(foundProject.conceptProject));
                setProjectId(String(foundProject.id));
            }
        }

        if (areaData.length > 0) {
            const areas = areaData.find(project => project.id === dataRoutesCDP?.budgetRoute.projectVinculation.functionalAreaId);
            if (areas) {

                setAreaNumber(String(areas.number));
            }
        }
    }, [dataRoutesCDP, projectsData]);


    useEffect(() => {
        const amount = dataRoutesCDP?.amount ?? 0;
        const idcModifiedCreditNumber = idcModifiedCredit ?? 0;
        const modifiedIdcCountercreditNumber = modifiedIdcCountercredit ?? 0;
        const idcFixedCompletedNumber = idcFixedCompleted ?? 0;

        const resultFinal = Math.max(0, (Number(amount) + idcModifiedCreditNumber) - modifiedIdcCountercreditNumber - idcFixedCompletedNumber);
        setIdcFinalValue(resultFinal);


    }, [dataRoutesCDP, idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted]); // Incluye todas las dependencias relevantes aquí


    //validar por valores
    const fetchBalance = async () => {
        if (dataRoutesCDP) {
            try {
                const objectSendData = {
                    posPreId: dataRoutesCDP.budgetRoute.pospreSapiencia.id,
                    foundId: dataRoutesCDP.budgetRoute.fund.id,
                    projectId: dataRoutesCDP.budgetRoute.idProjectVinculation,
                };
                console.log(objectSendData)
                const res = await getOneRpp(objectSendData);
                setBalance(parseInt(res['balance']));
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
    };

    useEffect(() => {
        fetchBalance()
        console.log('balance', balance)
        if (idcModifiedCredit >= idcFinalValue) {
            setDisable(true)
        } else {
            setDisable(false)
        }
    })


    // Este efecto se ejecutará cada vez que cambien idcModifiedCredit, modifiedIdcCountercredit, o idcFixedCompleted.
    useEffect(() => {
        // Solo recalcula si dataRoutesCDP ya ha sido cargado
        if (dataRoutesCDP) {
            if (dataRoutesCDP.idcFinalValue || Number(dataRoutesCDP.idcFinalValue) > 0) {
                const recalculatedValue = Math.max(0, (Number(dataRoutesCDP.idcFinalValue) + idcModifiedCredit) - modifiedIdcCountercredit - idcFixedCompleted);
                setIdcFinalValue(recalculatedValue); // Actualiza el estado con el nuevo valor calculado
                setValue("idcFinalValue", recalculatedValue); // Actualiza el valor en el formulario
            } else {
                const recalculatedValue = Math.max(0, (Number(dataRoutesCDP.amount) + idcModifiedCredit) - modifiedIdcCountercredit - idcFixedCompleted);
                setIdcFinalValue(recalculatedValue); // Actualiza el estado con el nuevo valor calculado
                setValue("idcFinalValue", recalculatedValue); // Actualiza el valor en el formulario
            }
        }
    }, [idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted, dataRoutesCDP, setValue]);
    


    //setear valores
    useEffect(() => {
        if (!dataRoutesCDP) return;

        //Obtener mes
        const date = new Date(dataRoutesCDP.budgetAvailability.date);
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthText = monthNames[date.getMonth()];


        // Asignar los campos que siempre vienen
        setValue("date", dataRoutesCDP.budgetAvailability.date);
        setValue("exercise", dataRoutesCDP.budgetAvailability.exercise);
        setValue("month", monthText);
        setValue("consecutive", dataRoutesCDP.budgetAvailability.consecutive);
        setValue("contractObject", dataRoutesCDP.budgetAvailability.contractObject);
        setValue("sapConsecutive", dataRoutesCDP.budgetAvailability.sapConsecutive);
        setValue("numberFound", dataRoutesCDP.budgetRoute.fund.number);
        setValue("numberPospre", dataRoutesCDP.budgetRoute.pospreSapiencia.number);
        setValue("cdpPosition", dataRoutesCDP.cdpPosition);
        setValue("numberProject", projectNumber);
        setValue("nameProject", projectName);
        setValue("areaNumber", areaNumber);
        setValue("managementCenter", centroGestor);
        setValue("div", dataRoutesCDP.budgetRoute.div);
        setValue("amount", dataRoutesCDP.amount);

        setValue("modifiedIdcCountercredit", Number(dataRoutesCDP.modifiedIdcCountercredit));
        setValue("idcModifiedCredit", Number(dataRoutesCDP.idcModifiedCredit));
        setValue("idcFixedCompleted", Number(dataRoutesCDP.idcFixedCompleted));
        setValue("idcFinalValue", Number(dataRoutesCDP.idcFinalValue));



    }, [dataRoutesCDP, projectNumber, projectName, areaNumber, centroGestor]);

    const onSubmiteditRouteCDP = handleSubmit(async (data: IUpdateRoutesCDP) => {

        setMessage({
            show: true,
            title: "Guardar",
            description: "¿Estás segur@ de guardar la informacion ?",
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk() {
                confirmEdit(data);
            },
            background: true,
        });





    });

    const confirmEdit = async (data: IUpdateRoutesCDP) => {

        const datos: IUpdateRoutesCDP = {
            idRppCode: dataRoutesCDP.idRppCode,
            cdpPosition: data.cdpPosition,
            amount: Number(data.amount),
            modifiedIdcCountercredit: data.modifiedIdcCountercredit,
            idcModifiedCredit: data.idcModifiedCredit,
            idcFixedCompleted: data.idcFixedCompleted,
            idcFinalValue: idcFinalValue
        }

        console.log('llego', datos)

        const res = await updateRouteCdp(parseInt(idRoute), datos);

        if (res && res?.operation?.code === EResponseCodes.OK) {
            setMessage({
                OkTitle: "Cerrar",
                description: "¡Guardado exitosamente!",
                title: "Guardado",
                show: true,
                type: EResponseCodes.OK,
                background: true,
                onOk() {
                    reset();
                    setMessage({});
                    navigate("/gestion-financiera/cdp");
                },
                onClose() {
                    reset();
                    setMessage({});
                },
            });

        } else {
            setMessage({
                type: EResponseCodes.FAIL,
                title: "Guardar",
                description: "El registro no se pudo actualizar",
                show: true,
                OkTitle: "Cerrar",
                background: true,
            });
        }
    }

    const CancelFunction = () => {
        setMessage({
            show: true,
            title: "Cancelar",
            description: "¿Estas segur@ de cancelar?",
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk() {
                navigate("/gestion-financiera/cdp");
                setMessage((prev) => ({ ...prev, show: false }));
            },
            background: true,
        });
    };


    return {
        control,
        register,
        onSubmiteditRouteCDP,
        idcFinalValue,
        disable,
        CancelFunction
    };

}