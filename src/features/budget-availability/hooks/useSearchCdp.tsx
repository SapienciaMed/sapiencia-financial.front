import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IBudgetsAvailabilityFilters } from "../interfaces/budgetAvailabilityInterfaces";
import { tableColumnsCdp } from "../constants";
import { useCdpServices } from "./useCdpServices";
import { clearRequestFilters, filterDataSelect } from "../utils/filtersSearch";
import { useNavigate } from "react-router-dom";

export const useSearchCdp = () => {
  const { GetRoutesByValidity } = useCdpServices();
  const resolver = useYupValidationResolver(budgetAvailabilityValidator);
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue: setValueRegister,
    reset,
    watch,
    control,
  } = useForm<IBudgetsAvailabilityFilters>({
    resolver,
    mode: "all",
  });
  const inputValue = watch(["dateOfCdp"]);
  let [initialDate, endDate] = watch(["initialDate", "endDate"]);
  const tableActionsCdp: any[] = [
    {
      icon: "Detail",
      onClick: (row) => {},
    },
    {
      icon: "Edit",
      onClick: (row) => {
        const id = row.id;
        navigate(`/gestion-financiera/cdp/edit/${id}`);
      },
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

  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [arraySelect, setArraySelect] = useState<any>([]);

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

  useEffect(() => {
    if (initialDate && endDate === undefined) {
      setValueRegister("endDate", initialDate);
    }
    if (endDate && initialDate === undefined) {
      setValueRegister("initialDate", endDate);
    }
  }, [initialDate, endDate]);

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
    initialDate,
    endDate,
  };
};
