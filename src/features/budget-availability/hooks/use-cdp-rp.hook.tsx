import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCdpService } from "./cdp-service";
import { IRoutesCDP } from "../interfaces/RouteCDPInterface";
import { useParams } from "react-router-dom";
import { EResponseCodes } from "../../../common/constants/api.enum";


export const useCdpRp = () => {
  const tableComponentRef = useRef(null);
  const { id: idRoute } = useParams();
  

  const { getRouteCDPId, getOneRpp } = useCdpService();

  //States
  const [dataRoutesCDP, setDataRoutesCDP] = useState<IRoutesCDP>(null);

  //form
  const { handleSubmit, register, formState: { errors, isValid }, setValue: setValueRegister, reset, watch, control,setValue  } = useForm({});

  useEffect(() => {
    getRouteCDPId(parseInt(idRoute)).then((response) => {
      if (response.operation.code === EResponseCodes.OK) {        
        setDataRoutesCDP(response.data);
      }
    });

    
  }, [idRoute]);
  
  console.log(dataRoutesCDP)

  useEffect(() => {
    if (!dataRoutesCDP) return;


    //Obtener mes
    const date = new Date(dataRoutesCDP.budgetAvailability.date);
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthText = monthNames[date.getMonth()];


    // Asignar los campos que siempre vienen
    setValue("date", dataRoutesCDP.budgetAvailability.date);   
    setValue("sapConsecutive", dataRoutesCDP.budgetAvailability.sapConsecutive);
    setValue("consecutive", dataRoutesCDP.budgetAvailability.consecutive);
    setValue("contractObject", dataRoutesCDP.budgetAvailability.contractObject);


   



}, [dataRoutesCDP]);

  const tableColumnsCdp: any[] = [
    {
      fieldName: "consecutive",
      header: "No. SAP",
    },
    {
      fieldName: "sapConsecutive",
      header: "No. Aurora",
    },
    {
      fieldName: "date",
      header: "Posición",
    },
    {
      fieldName: "date",
      header: " ID Fiscal",
    },
    {
      fieldName: "date",
      header: "Proyecto",
    },
    {
      fieldName: "date",
      header: "Fondo",
    },
    {
      fieldName: "date",
      header: "Pospre",
    },
    {
      fieldName: "date",
      header: "Valor",
    },
  ]

  const tableActionsCdp: any[] = [
    {
      icon: "Detail",
      onClick: (row) => { },
    },
    {
      icon: "Edit",
      onClick: (row) => { },
    },
    {
      icon: "Add",
      onClick: (row) => { },
    },
    {
      icon: "Rp",
      onClick: (row) => { },
    },
  ];


  


  return {
    control,
    register,
    tableActionsCdp,
    tableColumnsCdp,
    tableComponentRef
  }
}