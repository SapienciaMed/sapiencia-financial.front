import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { IAdditionsIncome } from "../interfaces/Additions";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsAdditionalValidation } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IMessage } from "../../../common/interfaces/global.interface";

export function useAdditionAreaCrud() {
  const resolver = useYupValidationResolver(fundsAdditionalValidation);
  const { setMessage } = useContext(AppContext);

  const {
    handleSubmit,
    register: registerTabs,
    control: controlRegisterTabs,
    watch,
    getValues,
  } = useForm<IAdditionsIncome>({
    defaultValues: {
      ingreso: [],
    },
    mode: "all",
    resolver,
  });

  // Effect que activa el watch que detecta los cambios en todo el form
  React.useEffect(() => {
    const subscription = watch(() => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IAdditionsIncome) => {});

  const showModal = (values: IMessage) => {
    setMessage({
      title: values.title,
      description: values.description,
      show: true,
      OkTitle: values.OkTitle,
      onOk: values.onOk,
    });
  };

  return {
    controlRegisterTabs,
    registerTabs,
    watch,
    onSubmitTab,
    showModal,
    setMessage,
    getValues,
  };
}
