import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";


export const useCdpRp = () => {
    const tableComponentRef = useRef(null);


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
          onClick: (row) => {},
        },
        {
          icon: "Edit",
          onClick: (row) => {},
        },
        {
          icon: "Add",
          onClick: (row) => {},
        },
        {
          icon: "Rp",
          onClick: (row) => {},
        },
      ];


    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        reset,
        watch,
        control,
      } = useForm({});


    return {
        control,
        register,
        tableActionsCdp,
        tableColumnsCdp,
        tableComponentRef
    }
}