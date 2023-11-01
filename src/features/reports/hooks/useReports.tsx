import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { inputsValues } from "../constants";

const useReports = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    control,
  } = useForm<any>({
    // resolver,
    mode: "onChange",
  });
  const inputValue = watch(inputsValues);
  const { setMessage } = useContext(AppContext);
  const navigate = useNavigate();
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string>("");

  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined)
    );
  }, [inputValue]);

  const onSubmit = handleSubmit(async (data: any) => {
    console.log({ data });
  });

  return {
    onSubmit,
    control,
    register,
    errors,
    isBtnDisable,
    setMessage,
    navigate,
    isValid,
    selectedReport,
    setSelectedReport,
  };
};

export default useReports;
