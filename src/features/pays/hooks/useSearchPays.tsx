import React, { useEffect, useRef, useState,useContext } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IPacFilters } from "../../pac/interface/Pac";
import { useCdpServices } from "../../budget-availability/hooks/useCdpServices";
import { clearRequestFilters, filterDataSelect } from "../../budget-availability/utils/filtersSearch";
import { useNavigate } from "react-router-dom";
import { IPagoFilters } from "../interfaces/paysInterfaces";
import { paysLoad } from "../../../common/schemas/pays-schemas";
import { usePaysServices } from "./pays-service";
import useStorePays from "../../../store/store-pays";
import { AppContext } from "../../../common/contexts/app.context";
export const useSearchPays = () => {
  const { GetRoutesByValidity } = useCdpServices();
  const resolver = useYupValidationResolver(paysLoad);
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  const { infoErrors, setInfoErrors, setInfoSearchPays } = useStorePays()
  const { validateActionAccess } = useContext(AppContext);
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
  const { getPays } = usePaysServices('financial')
  

  const tableColumnsCdp: any[] = [
    {
      fieldName: "PAG_MES",
      header: "Mes",
    },
    {
      fieldName: "CONSECUTIVO_SAP",
      header: "Consecutivo RP SAP",
    },
    {
      fieldName: "VRP_POSICION",
      header: "Posicion RP",
    },
    {
      fieldName: "VRP_VALOR_FINAL",
      header: "Valor final",
    },
    {
      fieldName: "PAG_VALOR_CAUSADO",
      header: "Causado",
    },
    {
      fieldName: "PAG_VALOR_PAGADO",
      header: "Pagado",
    },
  ];


  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined)
    );
  }, [inputValue]);

  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }


  const onSubmit = handleSubmit(async (data: any) => {
    clearRequestFilters(data);
    if (data) {
      setShowTable(true);
      loadTableData(data);
      let response = await getPays(data);
      let informationResponse = response['data'];
      let valorFinal = 0;
      let valorCausado = 0;
      let valorPagado = 0;
      let pendientePago = 0;
      let pendienteCausado = 0;
      
      let arr = [];
      informationResponse['array'].forEach(element => {
        valorCausado += parseFloat(element.PAG_VALOR_CAUSADO)
        valorPagado += parseFloat(element.PAG_VALOR_PAGADO)
        valorFinal += parseFloat(element.VRP_VALOR_FINAL)
      });

      pendientePago = valorFinal -valorPagado
      pendienteCausado = valorFinal -valorCausado

      arr.push({
        valorCausado,pendienteCausado,valorPagado,pendientePago
      });

      setInfoSearchPays(arr)
      
    }
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
    navigate,
    arraySelect,
    validateActionAccess
  };
};
