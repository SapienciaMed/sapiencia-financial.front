import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import {
  IBudgetsAvailabilityFilters,
  IFiltersSelect,
} from "../interfaces/budgetAvailabilityInterfaces";
import {
  tableColumnsCdp,
  tableActionsCdp,
  initialFiltersSelect,
} from "../constants";
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
  const [arraySelect, setArraySelect] =
    useState<IFiltersSelect>(initialFiltersSelect);

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
        setArraySelect(initialFiltersSelect);
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
