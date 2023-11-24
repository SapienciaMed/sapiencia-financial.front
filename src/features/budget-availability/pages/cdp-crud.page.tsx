import React, { useState, useEffect, useContext } from 'react';
import FormCreateRutaCDPComponent from '../components/form-create-ruta-cdp.component';
import { useCdpService } from '../hooks/cdp-service';
import '../../../styles/from-create-cdp.scss';
import Icons from '../components/Icons'
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../../common/contexts/app.context';
import CdpHeadFormComponent from '../components/cdp-head-form.component';
import CdpheadCreate from '../components/cdp-head-create.component';
import PaginatorComponent from '../components/paginator-cdp.component';
import CdpPaginator from '../components/cdp-paginator.component';
import { log } from 'console';
import useStore from '../../../store/store';
import useStoreTwo from '../../../store/storeTwo';
import useStoreIcd from '../../../store/store-icd';

interface FormInfoType {
  id: number;
  idRppCode: string;
  posicion: string;
  valorInicial: string;
  balance: string;
}
interface FormularioProps {
  isRequired?: boolean;
  formNumber: number;
  handleEliminar: (formNumber: number) => void;
  formSubmitted?: boolean;

}

const CdpCrudPage = () => {
  const { formDataCdpRoute, setFormDataCdpRoute } = useStore();
  const { totalDataRuta, setTotalDataRuta } = useStoreTwo();
  const { icdImportsData } = useStoreIcd();
  const { setMessage } = useContext(AppContext);
  const { formInfo } = useContext(AppContext);
  const [formCount, setFormCount] = useState(2);
  const [formularios, setFormularios] = useState([]);
  const [formHeadInfo, setFormHeadInfo] = useState({})
  const [objectSendData, setObjectSendData] = useState({})
  const cdpService = useCdpService();
  const navigate = useNavigate();
  const [proyectoError, setProyectoError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [deleteRouteTwo, setDeleteRouteTwo] = useState(false);
  const [formStates, setFormStates] = useState({});
  const [amountInfo, setAmountInfo] = useState<FormInfoType>({
    idRppCode: "",
    posicion: "",
    valorInicial: "",
    balance: "",
    id: 0,
  });
  const [dataFinalSend, setDataFinalSend] = useState([]);

  const handleProyectoError = (selectedProyecto) => {
    if (!selectedProyecto) {
      setProyectoError(true);
    } else {
      setProyectoError(false);
    }
  };

  const handleAgregarFormulario = () => {
    const newFormulario = { id: formCount };
    setFormularios([...formularios, newFormulario]);
    setFormCount(formCount + 1);
  /*   if(!deleteRouteTwo){
      setTimeout(() => {
        handleEliminar(1)
        setDeleteRouteTwo(true);
      }, 500);
    } */
  };

  const updateFormInGlobalState = (formNumber, updatedInfo) => {
    const updatedFormData = formDataCdpRoute.map((form) =>
      form.id === formNumber ? { ...form, ...updatedInfo } : form
    );
    setFormDataCdpRoute(updatedFormData);
  };

  const updateFormState = (formNumber, updatedState) => {
    setFormStates((prevFormStates) => ({
      ...prevFormStates,
      [formNumber]: { ...prevFormStates[formNumber], ...updatedState },
    }));
  };

  const handleEliminar = (formNumber) => {

    console.log(formNumber);
    
    setDataFinalSend((prevFormularios) =>
      prevFormularios.filter((form) => form.id !== (formNumber+1))
    );
    
    setFormularios((prevFormularios) =>
      prevFormularios.filter((form) => form.id !== (formNumber+1))
    );
  
    setFormCount((prevCount) => prevCount - 1);
  
    if (currentForms.length === 1 && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
   const updatedIcdArr = objectSendData['icdArr'].filter((item) => item.id !== formNumber);
  const updatedObjectSendData = { ...objectSendData, icdArr: updatedIcdArr };
  setObjectSendData(updatedObjectSendData); 
  };
  
  
useEffect(() => {
  handleAgregarFormulario()
}, [])

  useEffect(() => {

    const index = dataFinalSend.findIndex(item => item.id === icdImportsData['id']);

    if (index !== -1) {
      setDataFinalSend(prevData => {
        const newData = [...prevData];
        newData[index] = icdImportsData;
        return newData;
      });
    } else {
      setDataFinalSend(prevData => [...prevData, icdImportsData]);
    }

    let finalObj = {
      date: formHeadInfo['date'],
      contractObject: formHeadInfo['contractObject'],
      exercise: formHeadInfo['exercise'],
      icdArr: dataFinalSend
    };
    setObjectSendData(finalObj);
    
  }, [icdImportsData,formHeadInfo]);

  const handleCancel = () => {
    setMessage({
      title: "Cancelar",
      description: "¿Estás segur@ de cancelar?",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        //onCancelNew();
        navigate("./../");
        setMessage({});
      },
      onCancel() {
        setMessage({});
      },
      background: true,
    });

  }

  const handleGuardar = async () => {
    setFormSubmitted(true);
    let nuevoObjeto;
    const onCancelNew = () => {
      navigate("./");
    };

    const icdArrWithBalanceCheck = objectSendData["icdArr"].slice(1);
    
    const hasEmptyFieldsOrZeros = icdArrWithBalanceCheck.some((item) => {
      for (const key in item) {
        if (key === 'posicion' || key === 'id') {
          continue; // Saltar 'posicion' e 'id'
        }
    
        if (typeof item[key] === 'string' && (item[key].trim() === '' || item[key] === '0')) {
          console.log("Campo vacío o con valor en 0 encontrado:", key, item[key]);
          return true;
        } else if (typeof item[key] === 'number' && item[key] === 0) {
          console.log("Campo con valor en 0 encontrado:", key, item[key]);
          return true;
        }
      }
      return false;
    });

    const emptyHeadInfo = Array.isArray(formHeadInfo) && formHeadInfo.some((item) => {
      if (item == null || item === "") {
        console.log("Campo necesario");
        return true;
      }
      return false;
    });
    
    if (hasEmptyFieldsOrZeros || emptyHeadInfo) {
      console.log("Hay campos vacíos o con valores en 0. No se puede continuar.");
      
      return;
    }
    

    try {
      const icdArrWithBalanceCheck = objectSendData["icdArr"].slice(1);

      const invalidBalances = icdArrWithBalanceCheck.filter(
        (item) => parseInt(item.valorInicial) >= parseInt(item.balance)
      );

      if (invalidBalances.length !== 0) {
        setMessage({
          title: "Validar valor inicial",
          description: "Recuerda que el valor inicial no puede ser mayor o igual al saldo disponible de la ruta presupuestal",
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            setMessage({});
          },
          background: true,
        });

        return;
      }

      if (invalidBalances.length === 0) {
        const updatedIcdArr = icdArrWithBalanceCheck.map(({ balance, ...rest }) => rest);

        nuevoObjeto = {
          ...objectSendData,
          exercise: objectSendData["exercise"],
          date: objectSendData["date"] && typeof objectSendData["date"] === "string" ? objectSendData["date"].split("/").join("-") : null,
          contractObject: objectSendData["contractObject"],
          consecutive: 10,
          icdArr: updatedIcdArr.map(({ proyecto, posicion, valorInicial, id, ...rest }) => ({
            idRppCode: parseInt(proyecto),
            cdpPosition: parseInt(posicion),
            amount: parseFloat(valorInicial),
            ...rest,
          })),
        };

        await new Promise((resolve) => {
          setObjectSendData(nuevoObjeto);
          resolve('success');
        });
        setMessage({
          title: "Guardar",
          description: `¿Estás segur@ de guardar la informacion ?`,
          show: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: async () => {
            try {
              const response = await cdpService.createCdp_(nuevoObjeto);
            

              setTimeout(() => {
                if (response['operation']['code'] == "OK") {
                  setMessage({
                    title: "Guardado",
                    description: "Guardado Exitosamente!",
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                      //onCancelNew();
                      navigate("./../");
                      setMessage({
                        title: "Consecutivo CDP Aurora",
                        description: `Al CDP sele asignó el consecutivo ${response["data"]['consecutive']}`,
                        show: true,
                        OkTitle: "Cerrar",
                        onOk: () => {
                          setMessage({});
                        },
                      });
                    },
                    background: true,
                  });
                }
              
                if (response['operation']['message'].indexOf("Ya existe") !== -1) {
                  setMessage({
                    title: "Validación de datos",
                    description: "¡El dato ya existe!",
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                      onCancelNew();
                      setMessage({});
                    },
                    background: true,
                  });
                  return
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
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  
  const formsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataComplete, setDataComplete] = useState([]);
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formularios.slice(indexOfFirstForm, indexOfLastForm);
  const totalForms = formularios.length;
  const totalPages = Math.ceil(totalForms / formsPerPage);

  const renderFormsForCurrentPage = () => {
    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
  
    return formularios
      .slice(indexOfFirstForm, indexOfLastForm)
      .map((_, index) => {
        const currentFormIndex = indexOfFirstForm + index;
       // const currentFormData = formDataCdpRoute?.find((form) => form.id === currentFormIndex);
       const foundObject = totalDataRuta.find(obj => obj.id === currentFormIndex);

        return (
          <FormCreateRutaCDPComponent
          key={currentFormIndex}
          isRequired={currentFormIndex === 0}
          formNumber={currentFormIndex}
          handleEliminar={handleEliminar}
          formSubmitted={formSubmitted}
          amountInfo={formStates[currentFormIndex] || {}}
          setAmountInfo={(updatedState) => updateFormState(currentFormIndex, updatedState)}
          datasFounds={foundObject}
        />
        );
      });
  };

  useEffect(() => {
    // Check if formDataCdpRoute is not empty
    if (formDataCdpRoute.length > 0) {
      // Update dataComplete based on formDataCdpRoute
      const newDataComplete = dataComplete.map((existingObj) => {
        const matchingIndex = formDataCdpRoute.findIndex(
          (newObj) => newObj.id === existingObj.id
        );

        if (matchingIndex !== -1) {
          // If the object exists in formDataCdpRoute, update it
          return formDataCdpRoute[matchingIndex];
        }

        return existingObj;
      });

      // Add new objects from formDataCdpRoute that don't exist in dataComplete
      formDataCdpRoute.forEach((newObj) => {
        const isNewObject = newDataComplete.every(
          (existingObj) => existingObj.id !== newObj.id
        );

        if (isNewObject) {
          newDataComplete.push(newObj);
        }
      });

      setDataComplete(newDataComplete);
    }
    
    setTotalDataRuta(dataComplete)
  
    
  }, [formDataCdpRoute]);


  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const indexOfLastForm = page * formsPerPage;
      const indexOfFirstForm = indexOfLastForm - formsPerPage;
      const updatedFormData = formDataCdpRoute.slice(indexOfFirstForm, indexOfLastForm);
    }
  };
  

  return (
    <div className='container-principal'>
      <div className="agregar-ruta-container">
        <h2>Crear CDP</h2>
        <button onClick={handleAgregarFormulario} className='agregar-ruta'>
          <div className="button-content">
            <Icons />
            <span>Agregar Ruta</span>
          </div>
        </button>
      </div>
      <CdpheadCreate formSubmitted={formSubmitted} isDisabled={false} setFormHeadInfo={setFormHeadInfo} />
       
        <div>
          {formularios.length > 0 && renderFormsForCurrentPage()}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CdpPaginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

      <div className="button-container component-container-create">
        <button onClick={handleCancel} className="cancel-btn">
          Cancelar
        </button>
        <p onClick={handleGuardar} className="btn-guardar">
          Guardar
        </p>
      </div>
    </div>
  );
};
export default React.memo(CdpCrudPage);
