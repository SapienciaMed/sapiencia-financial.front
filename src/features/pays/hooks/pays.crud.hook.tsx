import React,{useContext, useState, useRef} from "react";
import { useForm } from 'react-hook-form';
import { AppContext } from "../../../common/contexts/app.context";
import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { IPagoDataSave } from "../interfaces/paysInterfaces";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IErrorTablePac } from "../../pac/interface/Pac";
import { usePaysServices } from "./pays-service";

export function usePaysCrud(){
    const dateToday = new Date()

    const { setMessage, authorization } = useContext(AppContext);
    const navigate = useNavigate();
    const actualFullYear = dateToday.getFullYear();
    const [isAllowSave, setIsAllowSave] = useState(true)
    const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
    const tableComponentRef = useRef(null);
    const [errorsPac, setErrorsPac] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const api = usePaysServices();

    const onCancelNew = () => {
        navigate("./");
      };

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        reset,
        control,
        watch,
        getValues
      } = useForm<IPagoDataSave>({
        defaultValues: {
        tipoDocumento: actualFullYear.toString(),
        register: actualFullYear.toString(),
        },
        mode: 'onSubmit'
      });

      const tableColumns: ITableElement<IErrorTablePac>[] = [
        {
          fieldName: "rowError",
          header: "Fila"
        },
        {
          fieldName: "message",
          header: "Validación",
        },
    
      ];

      
      const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Error al leer el archivo como Base64.'));
            }
          };
      
          reader.onerror = () => {
            reject(new Error('Error al leer el archivo.'));
          };
      
          reader.readAsDataURL(file);
        });
      };

    const onSubmitPagPays = handleSubmit(async (data: IPagoDataSave) => {
        let formData = new FormData();
        let fileExcel = data.filedata;
        const base64Data = await readFileAsBase64(fileExcel);
        const tipoDocumento = data.tipoArchivo;

        let obInfo = {
            fileContent: base64Data,
            documentType:tipoDocumento,
            usuarioCreo:authorization.user.numberDocument
        }
        setMessage({
            title: "Guardar Información",
            description: `¿Estás segur@ de guardar la informacion ?`,
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: async () => {
              try {
                const response = await api.loadPays(obInfo)      
                setTimeout(() => {
                  if (response['operation']['code'] == "OK") {
                    setMessage({
                      title: "Confirmación",
                      description: "Guardado Exitosamente!",
                      show: true,
                      OkTitle: "Cerrar",
                      onOk: () => {
                        //onCancelNew();
                        navigate("./../");
                      },
                      background: true,
                    });
                  }
                

                  if (response['operation']['code'] === "FAIL") {
                    setMessage({
                      title: "Error al crear CDP",
                      description: response['operation']['message'],
                      show: true,
                      OkTitle: "Aceptar",
                      onOk: () => {
                        onCancelNew();
                        setMessage({});
                      },
                      background: true,
                    });
                    return
                  }
                }, 1500);
  
              } catch (error) {
                console.error("Error al enviar los datos:", error);
              }
              setMessage({});
            }, onCancel() {
              onCancelNew();
              setMessage({})
            },
            background: true,
          });
    
        return;
        
      });

      function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
          tableComponentRef.current.loadData(searchCriteria);
        }
      }

      return {
        onSubmitPagPays,
        errors,
        //showModal,
        setMessage,
        register,
        isAllowSave,
        control,
        actualFullYear,
        isVisibleTable,
        tableComponentRef,
        tableColumns,
        errorsPac,
        isLoading,
      }
}