import React, { useState, useEffect } from 'react';
import '../../../styles/from-create-cdp.scss';


interface FormularioProps {
  isRequired?: boolean;
  formNumber: number;
  handleEliminar: (formNumber: number) => void;
  setFormInfo: (data: {
    proyecto: string;
    nombreProyecto: string;
    fondo: string;
    pospre: string;
    areaFuncional: string;
    centroGestor: string;
    div: string;
    posicion: string;
    valorInicial: string;
  }) => void;
}

const FormCreateRutaCDPComponent: React.FC<FormularioProps> = ({ isRequired = false, formNumber, handleEliminar,setFormInfo }) => {  const [proyecto, setProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [fondo, setFondo] = useState('');
  const [pospre, setPospre] = useState('');
  const [areaFuncional, setAreaFuncional] = useState('');
  const [centroGestor, setCentroGestor] = useState('');
  const [div, setDiv] = useState('');
  const [posicion, setPosicion] = useState('');
  const [valorInicial, setValorInicial] = useState('');

  const onDeleteClick = () => {
    handleEliminar(formNumber);
  };
  const formValues = {
    id: formNumber,
    proyecto,
    nombreProyecto,
    fondo,
    pospre,
    areaFuncional,
    centroGestor,
    div,
    posicion,
    valorInicial
  };
  const loadInfo = () => {
    setFormInfo(formValues);
  };

  useEffect(() => {
    loadInfo();
  }, [proyecto, nombreProyecto, fondo, pospre, areaFuncional, centroGestor, div, posicion, valorInicial]);

  const handleProyectoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProyecto = event.target.value;
    setProyecto(selectedProyecto);
  };

  const handleNombreProyectoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombreProyecto(event.target.value);
  };

  const handleFondoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFondo = event.target.value;
    setFondo(selectedFondo);
  };
  
  const handlePospreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPospre = event.target.value;
    setPospre(selectedPospre);
  };

  const handleAreaFuncionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAreaFuncional(event.target.value);
  };

  const handleCentroGestorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCentroGestor(event.target.value);
  };

  const handleDivChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiv(event.target.value);
  };

  const handlePosicionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosicion(event.target.value);
  };

  const handleValorInicialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValorInicial(event.target.value);
  };

  

  return (
    <div className='containerOne'>
      <div className="formulario">
        <div className="grid-form">
          <h2 className="h3-style">{formNumber + 1}. Ruta</h2>
          <h2>Ruta presupuestal</h2>
          <div className="col-4">
            <label>Proyecto*</label>
            <select className="estilo-select" value={proyecto} onChange={handleProyectoChange} />
          </div>

          <div className="col-8">
            <label>Nombre proyecto*</label>
            <input type="text" className="estilo-input bgSecondary" value={nombreProyecto} onChange={handleNombreProyectoChange} />
          </div>

          <div className="col-4">
            <label>Fondo*</label>
            <select className="estilo-select" value={fondo} onChange={handleFondoChange} />
          </div>

          <div className="col-4">
            <label>Pospre*</label>
            <select className="estilo-select" value={pospre} onChange={handlePospreChange} />
          </div>

          <div className="col-4">
            <label>Área funcional*</label>
            <input type="text" className="estilo-input bgSecondary" value={areaFuncional} onChange={handleAreaFuncionalChange} />
          </div>

          <div className="col-4">
            <label>Centro gestor*</label>
            <input type="text" className="estilo-input bgSecondary" value={centroGestor} onChange={handleCentroGestorChange} />
          </div>

          <div className="col-4">
            <label>DIV*</label>
            <input type="text" className="estilo-input bgSecondary" value={div} onChange={handleDivChange} />
          </div>

          <div className="col-4">
            <label>Posición*</label>
            <input type="text" className="estilo-input bgSecondary" value={posicion} onChange={handlePosicionChange} />
          </div>

          <h3>Importe</h3>

          <div className="col-3">
            <label>Valor inicial*</label>
            <input type="text" className="estilo-input" value={valorInicial} onChange={handleValorInicialChange} />
          </div>

          {!isRequired && (
            <button className="agregar-btn" onClick={onDeleteClick}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCreateRutaCDPComponent;
