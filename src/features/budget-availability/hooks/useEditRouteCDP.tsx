import { useState, useEffect,useContext } from "react";
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


export function useEditrouteCDP(modifiedIdcCountercredit:number,idcModifiedCredit:number,idcFixedCompleted:number) {    
   
    //params url
    const navigate = useNavigate();
    const { id: idRoute } = useParams();
    const { setMessage } = useContext(AppContext);

    //services
    const { getRouteCDPId } = useCdpService()
    const { GetProjectsList } = useAdditionsTransfersService()
    const { GetAllFunctionalAreas } = useFunctionalAreaService()

    //states
    const [dataRoutesCDP, setDataRoutesCDP] = useState<IRoutesCDP>(null);
    const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);
    const [areaData, setAreaData] = useState<IFunctionalArea[]>([]);
    const [projectNumber, setProjectNumber] = useState("");
    const [projectName, setProjectName] = useState("");
    const [areaNumber, setAreaNumber] = useState("");
    const [centroGestor, setCentroGestor] = useState('91500000');
    const [idcFinalValue, setIdcFinalValue] = useState(0);
    //IProjectAdditionList
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
      
        const resultFinal = (Number(amount) + idcModifiedCreditNumber) - modifiedIdcCountercreditNumber - idcFixedCompletedNumber;
      
        setIdcFinalValue(resultFinal); // Asegúrate de que esta línea no esté comentada
        console.log(resultFinal);
      }, [dataRoutesCDP, idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted]); // Incluye todas las dependencias relevantes aquí
      



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
        //setValue("idcFinalValue", idcFinalValue);



    }, [dataRoutesCDP,projectNumber,projectName,areaNumber,centroGestor]);

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
            cdpPosition:data.cdpPosition,         
            amount:   data.amount,                
            modifiedIdcCountercredit: data.modifiedIdcCountercredit,
            idcModifiedCredit: data.idcModifiedCredit,
            idcFixedCompleted: data.idcFixedCompleted,
            idcFinalValue: idcFinalValue
        }

        console.log('llego',datos)
        /* 
            const res = await updateUser(parseInt(userId), user);

    if (res && res?.operation?.code === EResponseCodes.OK) {
      setMessage({
        okTitle: "Cerrar",
        description: "¡Usuario editado exitosamente!",
        title: "Usuario editado",
        show: true,
        type: EResponseCodes.OK,
        background: true,
        onOk() {
          reset();
          setMessage({});
          navigate("/core/usuarios/consultar");
        },
        onClose() {
          reset();
          setMessage({});
        },
      });
      setSending(false);
    } else {
      setMessage({
        type: EResponseCodes.FAIL,
        title: "Crear Usuario",
        description: "El usuario no se pudo actualizar",
        show: true,
        okTitle: "Aceptar",
        background: true,
      });
      setSending(false);
    }
        */

    }


    return {
        /*   control,
          errors,
          register,
          watch,
          setMessage,
          getValues,
          tableComponentRef,
          tableColumns,
          tableActions,
          cdpFoundSt */
        control,
        register,
        onSubmiteditRouteCDP,
        idcFinalValue
    };

}