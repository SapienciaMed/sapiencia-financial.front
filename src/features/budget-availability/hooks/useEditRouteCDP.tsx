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


export function useEditrouteCDP(modifiedIdcCountercredit: number, idcModifiedCredit: any, idcFixedCompleted: number) {

    //params url
    const navigate = useNavigate();
    const { id, idRoute } = useParams();
    const { setMessage } = useContext(AppContext);

    /* console.log('id', id);
    console.log('idRoute', idRoute); */

    //services
    const { getRouteCDPId, getOneRpp, updateRouteCdp, getTotalValuesImport } = useCdpService()
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
    const [totalRp, setTotalRp] = useState(0);
    const [totalICD, setTotalICD] = useState(0);
    const [totalFinalICD, setTotalFinalICD] = useState(0);
    const [disable, setDisable] = useState(false);

    //Form
    const { control, handleSubmit, register, watch, setValue, reset, formState: { errors }, } = useForm({});

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
        const idcModifiedCreditNumber = idcModifiedCredit ;
        const modifiedIdcCountercreditNumber = modifiedIdcCountercredit ;
        const idcFixedCompletedNumber = idcFixedCompleted ;

        const resultFinal = Math.max(0, (Number(amount) + idcModifiedCreditNumber) - modifiedIdcCountercreditNumber - idcFixedCompletedNumber);
        setIdcFinalValue(resultFinal);


        setValue("idcFinalValue", Number(resultFinal));


    }, [dataRoutesCDP, idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted]);

    //validar por valores



    
    const fetchBalance = async () => {

        if (dataRoutesCDP) {
            try {
                const objectSendData = {
                    posPreId: dataRoutesCDP.budgetRoute.pospreSapiencia.id,
                    foundId: dataRoutesCDP.budgetRoute.fund.id,
                    projectId: dataRoutesCDP.budgetRoute.idProjectVinculation,
                };

                const res = await getOneRpp(objectSendData);
                const resRP = await getTotalValuesImport(dataRoutesCDP.id);

                setBalance(Number(res['balance']));
                setTotalICD(Number(res['totalIdc']));

                setTotalRp(resRP.data.totalImport)

                setTotalFinalICD(balance - totalICD)

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
    };

   /*  console.log('balance',totalRp)
    console.log('totales',totalFinalICD) */
   
    const [debouncedIdcModifiedCredit, setDebouncedIdcModifiedCredit] = useState(idcModifiedCredit);
    const [debouncedIdcModifiedCounterCredit, setDebouncedIdcModifiedCounterCredit] = useState(modifiedIdcCountercredit);
    const [debouncedIdcFixedCompleted, setDebouncedIdcFixedCompleted] = useState(idcFixedCompleted);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedIdcModifiedCredit(idcModifiedCredit);
            setDebouncedIdcModifiedCounterCredit(modifiedIdcCountercredit);
            setDebouncedIdcFixedCompleted(idcFixedCompleted);
        }, 300);  // Retraso de 300ms

        return () => {
            clearTimeout(handler);
        };
    }, [idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted]);

    useEffect(() => {
        fetchBalance();
        const isCondition1 = Number(debouncedIdcModifiedCredit) > Number(totalFinalICD);
        const isCondition2 = Number(debouncedIdcModifiedCounterCredit) > Number(totalRp);
        const isCondition3 = Number(debouncedIdcFixedCompleted) > Number(totalRp);

        if (isCondition1  || isCondition2  || isCondition3 ) {
           // console.log('es menor')
            setDisable(true);
        } else {
            setDisable(false);
            //console.log('es mayor')
        }

    }, [totalRp, totalFinalICD, debouncedIdcModifiedCredit, debouncedIdcModifiedCounterCredit, debouncedIdcFixedCompleted]);



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
        setValue("amount", Number(dataRoutesCDP.amount));

        const modifiedCreditValue = dataRoutesCDP.idcModifiedCredit;
        const modifiedIdcCountercreditValue = dataRoutesCDP.modifiedIdcCountercredit;
        const idcFixedCompletedValue = dataRoutesCDP.idcFixedCompleted;

       // setValue("modifiedIdcCountercredit", Number(dataRoutesCDP.modifiedIdcCountercredit));

        setValue("modifiedIdcCountercredit", modifiedIdcCountercreditValue ? Number(modifiedIdcCountercreditValue) : '');
        setValue("idcModifiedCredit", modifiedCreditValue ? Number(modifiedCreditValue) : '');
        setValue("idcFixedCompleted", idcFixedCompletedValue ? Number(idcFixedCompletedValue) : '');

       // setValue("idcFixedCompleted", Number(dataRoutesCDP.idcFixedCompleted));
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
            modifiedIdcCountercredit: modifiedIdcCountercredit,
            idcModifiedCredit: idcModifiedCredit,
            idcFixedCompleted: idcFixedCompleted,
            idcFinalValue: idcFinalValue
        }      

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
        CancelFunction,

        totalRp,
        totalFinalICD
    };

}