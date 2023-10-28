import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IBudgetsAvailabilityFilters } from "../interfaces/budgetAvailabilityInterfaces";
import { tableColumnsCdp, tableActionsCdp } from "../constants";
import { useCdpServices } from "./useCdpServices";
import { clearRequestFilters, filterDataSelect } from "../utils/filtersSearch";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

export const useSearchCdp = () => {
  const { GetRoutesByValidity } = useCdpServices();
  const resolver = useYupValidationResolver(budgetAvailabilityValidator);
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    control,
  } = useForm<IBudgetsAvailabilityFilters>({
    resolver,
    mode: "all",
  });
  const inputValue = watch(["dateOfCdp"]);

  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [arraySelect, setArraySelect] = useState<any>([]);

    const tableColumnsCdp: any[] = [
      {
        fieldName: "consecutive",
        header: "No. CDP Aurora",
      },
      {
        fieldName: "sapConsecutive",
        header: "No. CDP SAP",
      },
      {
        fieldName: "date",
        header: "Fecha documento",
        renderCell: (row) => {
          return <>{DateTime.fromISO(row.date).toLocaleString()}</>;
        },
      },
      {
        fieldName: "countRpp",
        header: "No. de rutas del CDP",
        renderCell: (row) => {
          return <>{row.amounts.length}</>;
        },
      },
      {
        fieldName: "partnersRp",
        header: "RP asociados",
      },
      {
        fieldName: "contractObject",
        header: "Objeto contractual",
      },
    ];
    
    const tableActionsCdp: any[] = [
      {
        icon: "Detail",
        onClick: (row) => {
          navigate(`./view/${row.id}`);
        },
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

  const onSubmit = handleSubmit(async (data: { dateOfCdp: string }) => {
    clearRequestFilters(data);
    if (data.dateOfCdp) {
      setShowTable(true);
      loadTableData(data);
    }
  });

  useEffect(() => {
    const queryGetDataFilters = async () => {
      if (inputValue !== undefined && control._formValues.dateOfCdp) {
        const dataFilters = {
          dateOfCdp: control._formValues.dateOfCdp,
          page: 1,
          perPage: 10000,
        };
        try {
          const response = await GetRoutesByValidity(dataFilters);
          const responseFilterDataSelects = filterDataSelect(
            response.data.array
          );
          setArraySelect(responseFilterDataSelects);
        } catch (error) {
          console.log({ queryGetDataFilters: error });
        }
      } else {
        setArraySelect([]);
      }
    };
    queryGetDataFilters();
  }, [control._formValues.dateOfCdp]);

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
    arraySelect,
  };
};
