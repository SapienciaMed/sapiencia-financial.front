import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";
import { useBudgetRecordServices } from "./budget-record-services.hook";
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
import useYupValidationResolver from '../../../common/hooks/form-validator.hook';
import { editRpValidator } from '../../../common/schemas/editRP-validator';


export function useBudgeRecordEdit() {
    
    const navigate = useNavigate();
    const { id, idRp } = useParams();
    const { setMessage } = useContext(AppContext);   

    const resolver = useYupValidationResolver(editRpValidator);

    const { GetRpByFilters, GetAllComponents, GetCausation, editRp } = useBudgetRecordServices();
    const { GetProjectsList } = useAdditionsTransfersService();
    const { GetAllFunctionalAreas } = useFunctionalAreaService();
    const { GetAllDependencies,GetContractorsByDocuments } = usePayrollExternalServices();
    const { getRouteCDPId, getOneRpp, updateRouteCdp, getTotalValuesImport } = useCdpService()

    const [dataRp, setDataRp] = useState<any>()
    const [dataRpInitial, setDataRpInitial] = useState<any>()
    const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);
    const [areaData, setAreaData] = useState<IFunctionalArea[]>([]);
    const [areaNumber, setAreaNumber] = useState("");
    const [projectNumber, setProjectNumber] = useState("");
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [componentsData, setComponentssData] = useState<IDropdownProps[]>([]);
    const [totalCautation, setTotalCautation] = useState(0);
    const [RP, setRP] = useState(0);
    const [disabledButton, setDisabledButton] = useState(true);

    const [calculatedValue, setCalculatedValue] = useState(0);


    //Form
    const { control, handleSubmit, register, watch, setValue, reset, formState: { errors }, } = useForm({resolver});

    

   
    useEffect(() => {
        if (id) {
            GetRpByFilters({
                consecutiveRpSap: "",
                consecutiveRpAurora: id,
                supplierType: "",
                contractorDocument: ""
            }).then(res => {
                if (res.data && res.data.length > 0) {
                    setDataRpInitial(res.data[0]);

                }
            }).catch(err => {
                console.error("Error al obtener los datos:", err);

            });
        }

        
    }, [id]);

    //filtrar informacion por id de rp
    useEffect(() => {
        if (dataRpInitial && dataRpInitial.linksRp) {
            const filteredData = {
                ...dataRpInitial,
                linksRp: dataRpInitial.linksRp.filter(link => link.id == idRp)
            };            
            setDataRp(filteredData);
        }
    }, [dataRpInitial, idRp]);
    
   

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

        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            GetCausation(dataRp.linksRp[0].id).then(response => {
                setTotalCautation(response.data.total)
            }).catch(error => {
                console.error('Error al obtener valores totales:', error);
            });
        } else {
            console.log('causacion no está definidos o son un array vacío');
        }

        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            getTotalValuesImport(dataRp.linksRp[0].amountCdpId).then(response => {
                setRP(response.data.totalImport);
            }).catch(error => {
                console.error('Error al obtener valores totales:', error);
            });
        } else {
            console.log('dataRp o dataRp.linksRp no están definidos o son un array vacío');
        }


    }, [id, dataRp]);


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
    const inputAgaintsAmount = watch('againtsAmount')
    const inputCreditAmount = watch('creditAmount')
    const inputFixedCompleted = watch('fixedCompleted')  
    
    useEffect(() => {
        // Inicialmente asumimos que el botón debe estar deshabilitado
        let shouldDisableButton = true;

        // Si inputCreditAmount no ha cambiado, entonces evalúa las otras condiciones
        if (totalCautation !== undefined) {
            shouldDisableButton = inputAgaintsAmount > Number(totalCautation);
        }

        if (!shouldDisableButton && RP !== undefined) {
            shouldDisableButton = inputCreditAmount > RP;
        }

        if (!shouldDisableButton && totalCautation !== undefined && RP !== undefined) {
            shouldDisableButton = totalCautation > RP;
        }

        if (inputFixedCompleted > 0) {
            shouldDisableButton = false
        }

        setDisabledButton(shouldDisableButton);
    }, [totalCautation, RP, inputAgaintsAmount, inputCreditAmount, inputFixedCompleted]);
   
    

    //total
    useEffect(() => {
        if (dataRp && Array.isArray(dataRp.linksRp) && dataRp.linksRp.length > 0) {
            

            // Si todos los inputs están vacíos o son 0, usa el valor de finalAmount
            if (inputCreditAmount <= 0 && inputAgaintsAmount <= 0 && inputFixedCompleted <= 0) {
                setValue("idcFinalValue", dataRp.linksRp[0].finalAmount === 0 ||  dataRp.linksRp[0].finalAmount === null ? dataRp?.linksRp?.[0]?.initialAmount : dataRp.linksRp[0].finalAmount);

            } else {
                // Realiza el cálculo con los valores actuales, independientemente de si están completos o no
                const initialAmount = dataRp.linksRp[0].initialAmount || 0;
                const calculatedResult = Math.max(0, initialAmount + inputCreditAmount - inputAgaintsAmount - inputFixedCompleted);
                
                setCalculatedValue(calculatedResult);
                setValue("idcFinalValue", Number(calculatedResult));
            }
        }
    }, [dataRp, inputAgaintsAmount, inputCreditAmount, inputFixedCompleted]);


    useEffect(() => {
        if (!dataRp ) return;

        if (dataRp.supplierType === "Acreedor") {
            setValue("document", dataRp?.creditor?.document || "");
            setValue("name", dataRp?.creditor?.name || "");
            setValue("taxIdentification", dataRp?.creditor?.taxIdentification || "");            
        }else{
            GetContractorsByDocuments({
                documentList: [dataRp.contractorDocument]
            }).then(res => {
              const contractorName = Object(res).data?.data[0]?.firstName + " " +
              Object(res).data.data[0]?.secondName + " " +
              Object(res).data.data[0]?.surname + " " +
              Object(res).data.data[0]?.secondSurname;

              //numberDocument             
              setValue("document", dataRp?.contractorDocument || "");
             setValue("name",contractorName || "");
              setValue("taxIdentification", Object(res).data?.data[0]?.fiscalIdentification || "");            

               
            })
        }

       

        // Asignar los campos que siempre vienen
        setValue("dependencyId", dataRp?.dependencyId || "");
        setValue("fund", dataRp?.linksRp?.[0]?.amountBudgetAvailability?.budgetRoute?.fund?.number || "");
        setValue("pospreSapiencia", dataRp?.linksRp?.[0]?.amountBudgetAvailability?.budgetRoute?.pospreSapiencia?.number || "");
        setValue("projectName", dataRp?.linksRp?.[0]?.projectName || "");
        setValue("areaNumber", areaNumber || "");
        setValue("managementCenter", dataRp?.linksRp?.[0]?.amountBudgetAvailability?.budgetRoute?.managementCenter || "");
        setValue("div", dataRp?.linksRp?.[0]?.amountBudgetAvailability?.budgetRoute?.div || "");
        setValue("cdpPosition", dataRp?.linksRp?.[0]?.position || "");
        setValue("numberProject", projectNumber || "");
        setValue("dependencyId", dataRp?.dependencyId || "");
        setValue("contractualObject", dataRp?.contractualObject || "");
        setValue("componentId", dataRp?.componentId || "");
        setValue("amount", dataRp?.linksRp?.[0]?.initialAmount || "");
    
        setValue("observation", dataRp?.linksRp?.[0]?.observation || "");
        setValue("againtsAmount", dataRp?.linksRp?.[0]?.againtsAmount || "");
        setValue("creditAmount", dataRp?.linksRp?.[0]?.creditAmount || "");
        setValue("fixedCompleted", dataRp?.linksRp?.[0]?.fixedCompleted || "");
    
        //setValue("finalAmount", dataRp?.linksRp?.[0]?.finalAmount || "");
        //setValue("idcFinalValue", dataRp.linksRp[0].finalAmount === 0 ||  dataRp.linksRp[0].finalAmount === null ? dataRp?.linksRp?.[0]?.initialAmount : dataRp.linksRp[0].finalAmount);

        

    }, [dataRp, areaNumber, projectNumber]);

    

    const onSubmiteditRp = handleSubmit(async (data: IUpdateRP) => {
      
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
            againtsAmount: data.againtsAmount === 0 || !data.againtsAmount ? 0 : data.againtsAmount,
            creditAmount: data.creditAmount === 0 || !data.creditAmount ? 0 : data.creditAmount,
            finalAmount: calculatedValue,
            fixedCompleted: data.fixedCompleted === 0 || !data.fixedCompleted ? 0 : data.fixedCompleted,
            observation: data.observation
        }

        

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

    const CancelFunction = () => {
        setMessage({
            show: true,
            title: "Cancelar",
            description: "¿Estas segur@ de cancelar?",
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk() {
                navigate("/gestion-financiera/rp");
                setMessage((prev) => ({ ...prev, show: false }));
            },
            background: true,
        });
    };

    

    return {
        control,
        register,
        dependeciesData,
        componentsData,
        disabledButton,
        onSubmiteditRp,
        CancelFunction,
        totalCautation,
        RP,
        errors

    };
}