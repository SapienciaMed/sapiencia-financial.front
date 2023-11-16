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
  const [amountInfo, setAmountInfo] = useState<FormInfoType>({
    idRppCode: "",
    posicion: "",
    valorInicial: "",
    balance: "",
    id: 0,
  });
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
    if(!deleteRouteTwo){
      setTimeout(() => {
        handleEliminar(1)
        setDeleteRouteTwo(true);
      }, 500);
    }
  };

  const handleEliminar = (formNumber) => {
    setFormularios((prevFormularios) =>
      prevFormularios.filter((_, index) => indexOfFirstForm + index !== formNumber)
    );
    setFormCount((prevCount) => prevCount - 1);
  };
  function setInfoData() {
    console.log("amountInfo", amountInfo);

    if (Object.keys(amountInfo).length > 0) {

      if ('id' in amountInfo) {
        const id = typeof amountInfo.id === 'number' ? amountInfo.id : 0;
        const isExisting = formularios.some((item) => item.id === id);
        if (isExisting) {
          const updatedFormularios = formularios.map((item) => {
            if (item.id === id) {
              return amountInfo;
            }
            return item;
          });
          setFormularios(updatedFormularios);
        } else {
          const updatedFormularios = [...formularios, { ...amountInfo, id: id }];
          setFormularios(updatedFormularios);
        }
      }
    }

    let finalObj = {
      date: formHeadInfo['date'],
      contractObject: formHeadInfo['contractObject'],
      exercise: formHeadInfo['exercise'],
      icdArr: formularios
    }
    setObjectSendData(finalObj)
  }

  useEffect(() => {
    setInfoData()
  }, [amountInfo,formHeadInfo]);

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

  const hasEmptyFields = Object.values(objectSendData).some((value) => {
    return typeof value === "string" && value.trim() === "";
  });

  if (hasEmptyFields) {
    console.log("Hay campos vacíos. No se puede continuar.");
    return;
  }
    try {
      const icdArrWithBalanceCheck = objectSendData["icdArr"];

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
              console.log(response['operation']['code']);

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
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formularios.slice(indexOfFirstForm, indexOfLastForm);
  const totalForms = formularios.length;
  const totalPages = Math.ceil(totalForms / formsPerPage);

  const renderFormsForCurrentPage = () => {
    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    return formularios.slice(indexOfFirstForm, indexOfLastForm).map((_, index) => (
      <FormCreateRutaCDPComponent
        key={indexOfFirstForm + index}
        isRequired={indexOfFirstForm + index === 0}
        formNumber={indexOfFirstForm + index}
        handleEliminar={handleEliminar}
        formSubmitted={formSubmitted}
        amountInfo={amountInfo}
        setAmountInfo={setAmountInfo}
      />
    ));
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
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
