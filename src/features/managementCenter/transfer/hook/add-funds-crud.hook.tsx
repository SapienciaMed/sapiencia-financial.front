import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { validationFieldsCreatefunds } from "../../../../common/schemas/transfer-schema";
import { ICreateSourceForm } from "../interfaces/TransferAreaCrudInterface";
import { useAdditionsTransfersService } from "../../hook/additions-transfers-service.hook";
import { useContext, useEffect, useState } from "react";
import { IArrayDataSelect } from "../../../../common/interfaces/global.interface";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { AppContext } from "../../../../common/contexts/app.context";

export function useAddFundsCrud() {
    
    const resolver = useYupValidationResolver(validationFieldsCreatefunds);
    const { setMessage } = useContext(AppContext);
    const { GetFundsList, GetProjectsList, GetPosPreSapienciaList } = useAdditionsTransfersService()
    const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
        functionalArea: [],
        areas: [],
        funds: [],
        posPre: []
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        watch,
        setValue,
        getValues,
    } = useForm<ICreateSourceForm>({
      resolver,
      mode: "onChange",
      defaultValues: {
        destino: [],
        origen: [],
      },
    });
      

    useEffect(() => {
        if (!arrayDataSelect.functionalArea.length && !arrayDataSelect.funds.length && !arrayDataSelect.posPre.length) {
          GetProjectsList({ page: "1", perPage: "1" }).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
              const projectArray = response.data?.array || [];
    
              const seenNames = new Set();
              const arrayEntitiesProject = projectArray.reduce((acc, item) => {
                const description = item.conceptProject;
                const name = item.projectId;
                const value = item.id;
                const id = item.id;
                const area = [{
                  name: item.areaFuntional.number,
                  value: item.areaFuntional.id,
                  id: item.areaFuntional.id
                }]
    
                if (!seenNames.has(name)) {
                  seenNames.add(name);
                  acc.push({ name, value, id, area, description });
                }
    
                return acc;
              }, []);
    
              setArrayDataSelect(prevState => ({
                ...prevState,
                functionalArea: arrayEntitiesProject
              }));
            } else {
                setMessage({
                  title: `Error en la consulta de datos`,
                  show: true,
                  description: response.operation.message,
                  OkTitle: 'Aceptar',
                  background: true,
                  onOk: () => {
                    setMessage({});
                  },
                });
              }
          }).catch((error) => console.log(error))
    
          GetFundsList({ page: "1", perPage: "1" }).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
              const typeTransfersFunds = response.data?.array || [];
    
              const seenNames = new Set();
              const arrayEntitiesFund = typeTransfersFunds.reduce((acc, item) => {
                const name = item.number;
                const value = item.id;
                const id = item.id;
    
                if (!seenNames.has(name)) {
                  seenNames.add(name);
                  acc.push({ name, value, id });
                }
    
                return acc;
              }, []);
    
              setArrayDataSelect(prevState => ({ ...prevState, funds: arrayEntitiesFund }));
    
            } else {
                setMessage({
                  title: `Error en la consulta de datos`,
                  show: true,
                  description: response.operation.message,
                  OkTitle: 'Aceptar',
                  background: true,
                  onOk: () => {
                    setMessage({});
                  },
                });
              }
          }).catch((error) => console.log(error))
    
          GetPosPreSapienciaList().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
              const posPresapientes = response.data?.array || [];
    
              const seenNames = new Set();
              const arrayEntitiesPosPres = posPresapientes.reduce((acc, item) => {
                const name = item.number;
                const value = item.id;
                const id = item.id;
    
                if (!seenNames.has(name)) {
                  seenNames.add(name);
                  acc.push({ name, value, id });
                }
    
                return acc;
              }, []);
    
              setArrayDataSelect(prevState => ({ ...prevState, posPre: arrayEntitiesPosPres }));
            }else {
                setMessage({
                  title: `Error en la consulta de datos`,
                  show: true,
                  description: response.operation.message,
                  OkTitle: 'Aceptar',
                  background: true,
                  onOk: () => {
                    setMessage({});
                  },
                });
              }
          }).catch((error) => console.log(error))
        }
    
      }, [arrayDataSelect])

    const onSubmitTab = handleSubmit(async (data: ICreateSourceForm) => {})

    return {
        control,
        arrayDataSelect,
        setValue,
        onSubmitTab,
        getValues,
        register
    }
}