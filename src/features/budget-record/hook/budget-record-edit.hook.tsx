import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";
import { useBudgetRecordServices } from "./budget-record-services.hook";
import { IRP, Creditor, LinkRp } from '../interface/budgetRecordsEdit';
import { useForm } from 'react-hook-form';
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useFunctionalAreaService } from "../../functionality/hooks/functional-area-service.hook";
import { IProjectAdditionList } from "../../functionality/interfaces/AdditionsTransfersInterfaces";
import { IFunctionalArea } from "../../functionality/interfaces/Functional-Area";
import { usePayrollExternalServices } from "./payroll-external-services.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useCdpService } from "../../budget-availability/hooks/cdp-service";
import { IUpdateRP } from "../interface/updateRp";


export function useBudgeRecordEdit(modifiedIdcCountercredit:number,idcModifiedCredit:number,idcFixedCompleted:number) {
   /*  console.log('Modificado contracrédito', modifiedIdcCountercredit)
    console.log('Modificado crédito', idcModifiedCredit)
    console.log('Fijado concluído', idcFixedCompleted) */
    const navigate = useNavigate();
    const { id } = useParams();
    const { setMessage } = useContext(AppContext);

    const { GetRpByFilters,GetAllComponents,GetCausation,editRp } = useBudgetRecordServices();
    const { GetProjectsList } = useAdditionsTransfersService();
    const { GetAllFunctionalAreas } = useFunctionalAreaService();
    const { GetAllDependencies } = usePayrollExternalServices();
    const { getRouteCDPId, getOneRpp, updateRouteCdp, getTotalValuesImport } = useCdpService()

    const [dataRp, setDataRp] = useState<any>()
    const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);
    const [areaData, setAreaData] = useState<IFunctionalArea[]>([]);
    const [areaNumber, setAreaNumber] = useState("");
    const [projectNumber, setProjectNumber] = useState("");
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [componentsData, setComponentssData] = useState<IDropdownProps[]>([]);
    const [totalCautation, setTotalCautation] = useState(0);
    const [RP, setRP] = useState(0);
    const [disabledButton, setDisabledButton] = useState(false);

    const [calculatedValue, setCalculatedValue] = useState(0);


    //Form
    const { control, handleSubmit, register, watch, setValue, reset, formState: { errors }, } = useForm({});

    useEffect(() => {
        if (id) {
            GetRpByFilters({
                consecutiveRpSap: "",
                consecutiveRpAurora: id,
                supplierType: "",
                contractorDocument: ""
            }).then(res => {
                if (res.data && res.data.length > 0) {
                    setDataRp(res.data[0]);

                }
            }).catch(err => {
                console.error("Error al obtener los datos:", err);

            });
        }
    }, [id]);


    useEffect(() => {
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

        GetAllDependencies().then((res) => {
            const dependencies = Object(res).data.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setDependeciesData(dependencies)
        })

        GetAllComponents().then(res => {
            const componentes = res.data?.map(e => ({ id: e.id, name: e.name, value: e.id }))
            setComponentssData(componentes)
        })

        GetCausation(Number(id)).then(response => {
            setTotalCautation(response.data.total)        
        })

        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            getTotalValuesImport(dataRp.linksRp[0].amountBudgetAvailability.cdpCode).then(response => {
                setRP(response.data.totalImport);
            }).catch(error => {
                console.error('Error al obtener valores totales:', error);
            });
        } else {
            console.log('dataRp o dataRp.linksRp no están definidos o son un array vacío');
        }
 

    }, [id,dataRp]);
    
   

    


    useEffect(() => {
        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            const linksRpFirstElement = dataRp.linksRp[0];

            if (linksRpFirstElement.amountBudgetAvailability && linksRpFirstElement.amountBudgetAvailability.budgetRoute && projectsData.length > 0) {
                const foundProject = projectsData.find(project => project.id === linksRpFirstElement.amountBudgetAvailability.budgetRoute.projectVinculation.id);

                if (foundProject) {
                    setProjectNumber(String(foundProject.projectId));                    
                }
            }

            if (areaData.length > 0 && linksRpFirstElement.amountBudgetAvailability && linksRpFirstElement.amountBudgetAvailability.budgetRoute) {
                const areas = areaData.find(project => project.id === linksRpFirstElement.amountBudgetAvailability.budgetRoute.projectVinculation.functionalAreaId);

                if (areas) {
                    setAreaNumber(String(areas.number));
                }
            }
        }
    }, [dataRp, projectsData, areaData]);

    //calculos
    useEffect(() => {
       
        let shouldDisableButton = false;    
   
        if (totalCautation !== undefined && modifiedIdcCountercredit !== undefined) {
            shouldDisableButton = modifiedIdcCountercredit > totalCautation;
        }    
      
        if (!shouldDisableButton && RP !== undefined && idcModifiedCredit !== undefined) {
            shouldDisableButton = idcModifiedCredit > RP;
        }    
     
        if (!shouldDisableButton && totalCautation !== undefined && RP !== undefined) {
            shouldDisableButton = totalCautation >= RP;
        }    
        
        setDisabledButton(shouldDisableButton);
    
    }, [totalCautation, RP, modifiedIdcCountercredit, idcModifiedCredit]);
    
    //total
    useEffect(() => {
        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            const inputIdcModifiedCredit = idcModifiedCredit ?? 0;
            const inputModifiedIdcCountercredit = modifiedIdcCountercredit ?? 0;
            const inputIdcFixedCompleted = idcFixedCompleted ?? 0;
    
            // Si todos los inputs están vacíos o son 0, usa el valor de finalAmount
            if (inputIdcModifiedCredit <= 0 && inputModifiedIdcCountercredit <= 0 && inputIdcFixedCompleted <= 0) {
                setValue("idcFinalValue", dataRp.linksRp[0].finalAmount);

            } else {
                // Realiza el cálculo con los valores actuales, independientemente de si están completos o no
                const initialAmount = dataRp.linksRp[0].initialAmount || 0;
                const calculatedResult = initialAmount + inputIdcModifiedCredit - inputModifiedIdcCountercredit - inputIdcFixedCompleted;
    
                setCalculatedValue(calculatedResult);
                setValue("idcFinalValue", calculatedResult);
            }
        }
    }, [dataRp, idcModifiedCredit, modifiedIdcCountercredit, idcFixedCompleted]);
    
    
    
    
    

   


    useEffect(() => {
        if (!dataRp) return;  

        // Asignar los campos que siempre vienen
        setValue("document", dataRp.creditor.document);
        setValue("name", dataRp.creditor.name);
        setValue("taxIdentification", dataRp.creditor.taxIdentification);
        setValue("dependencyId", dataRp.dependencyId);
        setValue("fund", dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.fund.number);
        setValue("pospreSapiencia", dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.pospreSapiencia.number);
        setValue("projectName", dataRp.linksRp[0].projectName);
        setValue("areaNumber", areaNumber);
        setValue("managementCenter", dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.managementCenter);
        setValue("div", dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.div);
        setValue("cdpPosition", dataRp.linksRp[0].amountBudgetAvailability.cdpPosition);
        setValue("numberProject", projectNumber);
        setValue("dependencyId", dataRp.dependencyId);
        setValue("contractualObject", dataRp.contractualObject);
        setValue("componentId", dataRp.componentId);
        setValue("amount", dataRp.linksRp[0].initialAmount);

        setValue("observation", dataRp.linksRp[0].observation);
        setValue("againtsAmount", dataRp.linksRp[0].againtsAmount );
        setValue("creditAmount", dataRp.linksRp[0].creditAmount);
        setValue("fixedCompleted", dataRp.linksRp[0].fixedCompleted);

        setValue("finalAmount", dataRp.linksRp[0].finalAmount);
    }, [dataRp, areaNumber, projectNumber]);

    const onSubmiteditRp = handleSubmit(async (data: IUpdateRP) => {        
        console.log('llego',data)
        setMessage({
            show: true,
            title: "Guardar",
            description: "¿Estás segur@ de guardar la información?",
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk() {
                confirmEdit(data);
            },
            background: true,
        });
    });


   const confirmEdit = async (data: IUpdateRP) => {

        const datos = {
            againtsAmount:modifiedIdcCountercredit,
            creditAmount: idcModifiedCredit,
            finalAmount: data.finalAmount,
            fixedCompleted: idcFixedCompleted,
            observation: data.observation
        }   
        
        console.log(datos)

    const res = await editRp(dataRp.linksRp[0].id, datos);

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
                    navigate("/gestion-financiera/rp");
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



    return {
        control,
        register,
        dependeciesData,
        componentsData,
        disabledButton,
        onSubmiteditRp

    };
}