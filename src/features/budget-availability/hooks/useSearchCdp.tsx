import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";

export const useSearchCdp = () => {
  //   const resolver = useYupValidationResolver();
  const tableComponentRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    control,
  } = useForm({
    // resolver,
    mode: "all",
  });
  const inputValue = watch(["validity"]);

  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

  useEffect(() => {
    if (inputValue[0] && inputValue[0].length >= 4) {
      setIsBtnDisable(
        inputValue.some((value) => value != "" && value != undefined)
      );
    } else {
      setIsBtnDisable(false);
    }
  }, [inputValue]);

  const onSubmit = handleSubmit(async (data: any) => {
    console.log("🚀 ~ file: cdp.hook.tsx:22 ~ onSubmit ~ data:", data);
  });

  return {
    control,
    register,
    errors,
    onSubmit,
    isBtnDisable,
    reset,
    showTable,
    setShowTable,
    tableComponentRef,
  };
};
