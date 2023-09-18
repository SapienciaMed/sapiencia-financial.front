import { useForm, useWatch } from 'react-hook-form';
import useYupValidationResolver from "../../../../common/hooks/form-validator.hook";
import { validationFieldsCreatefunds } from "../../../../common/schemas/transfer-schema";
import { IAddFund, ICreateSourceForm } from "../interfaces/TransferAreaCrudInterface";
import { useAdditionsTransfersService } from "../../hook/additions-transfers-service.hook";
import { useContext, useEffect, useState } from "react";
import { IArrayDataSelect } from "../../../../common/interfaces/global.interface";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { AppContext } from "../../../../common/contexts/app.context";
import { validateArray } from "../../../../common/utils/validate-object";
import { useNavigate } from 'react-router-dom';

export function useAddFundsCrud() {
    
  const navigate = useNavigate();
  const resolver = useYupValidationResolver(validationFieldsCreatefunds);
  const { setMessage } = useContext(AppContext);
  const { GetFundsList, GetProjectsList, GetPosPreSapienciaList } = useAdditionsTransfersService()
  const [arrayDataSelect, setArrayDataSelect] = useState<IArrayDataSelect>({
      functionalArea: [],
      areas: [],
      funds: [],
      posPre: []
  })
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(true)
  const [ totalTransfer, setTotalTransfer ] = useState<string>('')

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isDirty },
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

  const watchOrigin = useWatch({
    control,
    name: 'origen'
  })

  const watchDesti =  useWatch({
    control,
    name: 'destino'
  })

  useEffect(() => {
    setTotalTransfer(addNumericalValues(watchOrigin).toString())
  },[ watchOrigin ])


  const addNumericalValues = (arr: IAddFund[]) =>  {
    return arr.reduce((total, item) => {
      const valor = parseFloat(item.value);
      return isNaN(valor) ? total : total + valor;
    }, 0);
  }

  useEffect(() => {
    const validate = validateArray(watchOrigin) && validateArray(watchDesti)
    setIsBtnDisable(validate)
  },[ watchDesti, watchOrigin ])

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

  const onSubmitTab = handleSubmit(async (data: ICreateSourceForm) => {
    setMessage({
      title: "Guardar",
      description: "¿Está segur@ de guardar la información en el sistema?",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        setMessage({})
      },
       background: true
    })
  })

  const formatMoney = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const onCancel = () => {
    setMessage({
      title: "Cancelar",
      description: "¿Está segur@ que desea cancelar los valores?",
      show: true,
      OkTitle: "Aceptar",
      onOk: () => {
        setMessage({});
        navigate(-1)
      },
    });
  }

  return {
    control,
    totalTransfer,
    arrayDataSelect,
    isBtnDisable,
    setValue,
    onCancel,
    register,
    getValues,
    onSubmitTab,
    formatMoney,
  }
}