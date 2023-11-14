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


export function useBudgeRecordEdit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { setMessage } = useContext(AppContext);

    const { GetRpByFilters,GetAllComponents,GetCausation } = useBudgetRecordServices();
    const { GetProjectsList } = useAdditionsTransfersService();
    const { GetAllFunctionalAreas } = useFunctionalAreaService();
    const { GetAllDependencies } = usePayrollExternalServices();

    const [dataRp, setDataRp] = useState<any>()
    const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);
    const [areaData, setAreaData] = useState<IFunctionalArea[]>([]);
    const [areaNumber, setAreaNumber] = useState("");
    const [projectNumber, setProjectNumber] = useState("");
    const [dependeciesData, setDependeciesData] = useState<IDropdownProps[]>([]);
    const [componentsData, setComponentssData] = useState<IDropdownProps[]>([]);
    const [totalCautation, setTotalCautation] = useState(0);

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


    }, [id]);

    console.log(totalCautation);
    


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



    useEffect(() => {
        if (!dataRp) return;

        /*  console.log(dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.fund.number)
         console.log(dataRp.linksRp[0].amountBudgetAvailability.budgetRoute.projectVinculation.functionalAreaId)
         console.log('arwa funcional', areaNumber) */

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


    }, [dataRp, areaNumber, projectNumber]);



    return {
        control,
        register,
        dependeciesData,
        componentsData

    };
}