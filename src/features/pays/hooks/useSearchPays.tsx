import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IPacFilters } from "../../pac/interface/Pac";
import { useCdpServices } from "../../budget-availability/hooks/useCdpServices";
import { clearRequestFilters, filterDataSelect } from "../../budget-availability/utils/filtersSearch";
import { useNavigate } from "react-router-dom";
import { IPagoFilters } from "../interfaces/paysInterfaces";
import { paysLoad } from "../../../common/schemas/pays-schemas";

export const useSearchPays = () => {
  const { GetRoutesByValidity } = useCdpServices();
  const resolver = useYupValidationResolver(paysLoad);
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    control,
  } = useForm<IPagoFilters>({
    resolver,
    mode: "all",
    
  });
  const inputValue = watch(['exercise','mes','vinculacionRpCode']);


  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [arraySelect, setArraySelect] = useState<any>([]);

  const tableColumnsCdp: any[] = [
    {
      fieldName: "mes",
      header: "Mes",
    },
    {
      fieldName: "vinculacionRpCode",
      header: "Consecutivo SAP RP",
    },
    {
      fieldName: "posicionRp",
      header: "Posicion RP",
    },
    {
      fieldName: "valorFinal",
      header: "Valor final",
    },
    {
      fieldName: "causado",
      header: "Causado",
    },
    {
      fieldName: "pagado",
      header: "Pagado",
    },
  ];

  const tableActionsCdp: any[] = [

  ];

  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined)
    );
  }, [inputValue]);

  function loadTableData(searchCriteria?: object): void {

      
      console.log("hola mundo");
      console.log(tableComponentRef.current);
      if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }

  const onSubmit = handleSubmit(async (data: any ) => {
    console.log(data);
    loadTableData(data)
    setShowTable(true)
    
  });


  useEffect(() => {
    let months = [
        { id: 1, value: 1, name: 'enero' },
        { id: 2, value: 2, name: 'febrero' },
        { id: 3, value: 3, name: 'marzo' },
        { id: 4, value: 4, name: 'abril' },
        { id: 5, value: 5, name: 'mayo' },
        { id: 6, value: 6, name: 'junio' },
        { id: 7, value: 7, name: 'julio' },
        { id: 8, value: 8, name: 'agosto' },
        { id: 9, value: 9, name: 'septiembre' },
        { id: 10, value: 10, name: 'octubre' },
        { id: 11, value: 11, name: 'noviembre' },
        { id: 12, value: 12, name: 'diciembre' },
      ];
      
      setArraySelect(months);
  },[])


  return {
    control,
    register,
    errors,
    isValid,
    onSubmit,
    isBtnDisable,
    reset,
    showTable,
    setShowTable,
    tableComponentRef,
    tableColumnsCdp,
    tableActionsCdp,
    navigate,
    arraySelect
  };
};
