import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCdpService } from "./cdp-service";
import { IRoutesCDP } from "../interfaces/RouteCDPInterface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IProjectAdditionList } from "../../functionality/interfaces/AdditionsTransfersInterfaces";
import { useAdditionsTransfersService } from "../../managementCenter/hook/additions-transfers-service.hook";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";


export const useCdpRp = () => {

  const navigate = useNavigate();
  const { id: idRoute } = useParams();

  //services
  const { getRpsCDPId } = useCdpService();

  //states
  const [dataRoutesCDP, setDataRoutesCDP] = useState<IBudgetAvalaibility>(null);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [projectsData, setProjectsData] = useState<IProjectAdditionList[]>([]);

  //Form
  const { register, control, setValue } = useForm({});


  useEffect(() => {
    if (idRoute) {
      getRpsCDPId(Number(idRoute)).then((response) => {
        if (response.operation.code === EResponseCodes.OK) {
          setDataRoutesCDP(response.data[0])
        }
      });
    }
  }, [idRoute]);



  useEffect(() => {
    if (!dataRoutesCDP) return;
    
    let newDate = new Date(dataRoutesCDP.date);
    
    newDate.setDate(newDate.getDate() + 1);

    console.log(newDate.toISOString().split('T')[0])

    setValue("date", newDate.toISOString().split('T')[0]);
    setValue("sapConsecutive", dataRoutesCDP.sapConsecutive);
    setValue("consecutive", dataRoutesCDP.consecutive);
    setValue("contractObject", dataRoutesCDP.contractObject);

    setShowTable(true);
    loadTableData({ amountCdpId: dataRoutesCDP.id });
  }, [dataRoutesCDP,]);


  const tableComponentRef = useRef(null);

  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }


  const tableColumns: ITableElement<any>[] = [
    {
      fieldName: "sapConsecutive",
      header: "No. SAP",
    },
    {
      fieldName: "consecutive",
      header: "No. Aurora",
    },
    {
      fieldName: "cdpPosition",
      header: "Posición",
    },
    {
      fieldName: "creditorIds",
      header: "ID Fiscal",
    },
    {
      fieldName: "projectName",
      header: "Proyecto",
    },
    {
      fieldName: "fundCode",
      header: "Fondo",
    },
    {
      fieldName: "pospreSapienciaCode",
      header: "Pospre",
    },
    {
      fieldName: "amount",
      header: "Valor",
    },
  ]

 /*  const tableActions: ITableAction<any>[] = [
   
  ]; */





  return {
    control,
    register,
    //tableActions,
    tableColumns,
    tableComponentRef,
    showTable,
    dataRoutesCDP
  }
}