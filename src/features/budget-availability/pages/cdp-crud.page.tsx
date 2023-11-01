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
const CdpCrudPage = () => {
  const { setMessage } = useContext(AppContext);
  const [formCount, setFormCount] = useState(1);
  const [formularios, setFormularios] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [formHeadInfo, setFormHeadInfo] = useState({})
  const [objectSendData, setObjectSendData] = useState({})
  const cdpService = useCdpService();
  const navigate = useNavigate();
  const [proyectoError, setProyectoError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleProyectoError = (selectedProyecto) => {
    if (!selectedProyecto) {
      setProyectoError(true);
    } else {
      setProyectoError(false);
    }
  };

  const handleAgregarFormulario = () => {
    setFormCount(formCount + 1);
  };

  const handleEliminar = (formNumber) => {
    setFormCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    if (Object.keys(formInfo).length > 0) {
      const id = formInfo['id'];
      const isExisting = formularios.some((item) => item.id === id);
      if (isExisting) {
        const updatedFormularios = formularios.map((item) => {
          if (item.id === id) {
            return formInfo;
          }
          return item;
        });
        setFormularios(updatedFormularios);
      } else {
        const updatedFormularios = [...formularios, formInfo];
        setFormularios(updatedFormularios);
      }
    }

    let finalObj = {
      date: formHeadInfo['date'],
      contractObject: formHeadInfo['contractObject'],
      exercise: formHeadInfo['exercise'],
      icdArr: formularios
    }
    setTimeout(() => {
      setObjectSendData(finalObj)
      console.log(formHeadInfo);

    }, 1000);
  }, [formInfo]);

  const handleGuardar = async () => {
    setFormSubmitted(true);
    let nuevoObjeto;
    const onCancelNew = () => {
      navigate("./");
    };
    try {
      const icdArrWithBalanceCheck = objectSendData["icdArr"];

      const invalidBalances = icdArrWithBalanceCheck.filter(
        (item) => parseInt(item.valorInicial) >= parseInt(item.balance)
      );

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
          title: "Crear CDP",
          description: `Recuerda que al aceptar se guardaran los datos en el sistema`,
          show: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: async () => {
            try {
              const response = await cdpService.createCdp_(nuevoObjeto);
              setTimeout(() => {
                if (response && response['operation']['code'] === "FAIL") {
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
                } else {
                  setMessage({
                    title: "Guardado",
                    description: "Guardado Exitosamente!!",
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                      //onCancelNew();
                      navigate("./../");
                      setMessage({});
                    },
                    background: true,
                  });
                  setMessage({});
                }
                console.log('Response:',);
              }, 1000);

            } catch (error) {
              console.error("Error al enviar los datos:", error);
            }
            // onCancelNew();
            setMessage({});
          },onCancel() {
            onCancelNew();
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
      {[...Array(formCount)].map((_, index) => (
        <FormCreateRutaCDPComponent
          key={index}
          isRequired={index === 0}
          formNumber={index}
          handleEliminar={handleEliminar}
          setFormInfo={setFormInfo}
          formSubmitted={formSubmitted}
        />
      ))}
      
      <div>
        {formularios.length > formsPerPage && (
          <div>
            <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
      <div className="button-container component-container-create">
        <button className="cancel-btn">
          Cancelar
        </button>
        <p onClick={handleGuardar} className="btn-guardar">
          Guardar
        </p>
      </div>
    </div>
  );
};

export default CdpCrudPage;
