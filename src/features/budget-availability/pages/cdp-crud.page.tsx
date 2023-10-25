import React, { useState, useEffect } from 'react';
import FormCreateRutaCDPComponent from '../components/form-create-ruta-cdp.component';
import { usePacService } from '../hooks/cdp-service';
import '../../../styles/from-create-cdp.scss';
import Icons from '../components/Icons'
const CdpCrudPage = () => {
  const [formCount, setFormCount] = useState(1);
  const [formularios, setFormularios] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const pacService = usePacService();

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


  }, [formInfo]);




  const handleGuardar = async () => {
    const data = formularios.map((formulario) => ({
      proyecto: formulario.proyecto,
      nombreProyecto: formulario.nombreProyecto,
      fondo: formulario.fondo,
      pospre: formulario.pospre,
      areaFuncional: formulario.areaFuncional,
      centroGestor: formulario.centroGestor,
      div: formulario.div,
      posicion: formulario.posicion,
      valorInicial: formulario.valorInicial
    }));

    let prueba = {
      "date": "2023-10-21",
      "contractObject": "Este es el Prueba new ",
      "consecutive": 21,
      "sapConsecutive": 1,
      "icdArr": [
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 111111
        },
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 12211
        }
      ]
    }

    try {
      const response = await pacService.createCdp_(prueba);
      console.log(response);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const formsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formularios.slice(indexOfFirstForm, indexOfLastForm);

  return (
    <div className='container-principal'>
   <button onClick={handleAgregarFormulario} className='agregar-ruta'>
  <div className="button-content">
    <Icons />
    <span>Agregar Ruta</span>
  </div>
</button>
      {[...Array(formCount)].map((_, index) => (
        <FormCreateRutaCDPComponent
          key={index}
          isRequired={index === 0}
          formNumber={index}
          handleEliminar={handleEliminar}
          setFormInfo={setFormInfo}
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
