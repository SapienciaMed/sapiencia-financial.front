import React, { useState, useEffect, useContext } from 'react';
import '../../../styles/from-create-cdp.scss';
import { useCdpService } from '../hooks/cdp-service';
import SelectSearch from './select-create-cdp.component';

import { useBudgetRoutesCrudData } from '../../budget-routes/hooks/budget-routes-crud.hook';

interface FormularioProps {
  isRequired?: boolean;
  formNumber: number;
  handleEliminar: (formNumber: number) => void;
  setFormInfo: (data: {
    proyecto: string;
    posicion: string;
    valorInicial: string;
    balance: string;
  }) => void;
}

const FormCreateRutaCDPComponent: React.FC<FormularioProps> = ({ isRequired = false, formNumber, handleEliminar, setFormInfo }) => {
  const cdpService = useCdpService();
  const [proyecto, setProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [fondo, setFondo] = useState('');
  const [pospre, setPospre] = useState('0');
  const [pospreNewV, setPospreNewV] = useState('');
  const [areaFuncional, setAreaFuncional] = useState('');
  const [centroGestor, setCentroGestor] = useState('91500000');
  const [div, setDiv] = useState('SAPI');
  const [posicion, setPosicion] = useState('1');
  const [valorInicial, setValorInicial] = useState('0');
  const [balance, setBalance] = useState('0')
  const [idRpp, setIdRpp] = useState('0')
  
  const onDeleteClick = () => {
    handleEliminar(formNumber);
  };

  const formValues = {
    proyecto: idRpp,
    posicion: posicion,
    valorInicial: valorInicial,
    id: formNumber,
    balance: balance,
  };

  const { pospreSapienciaDataCdp, projectsVinculateData, projectsData, fundsData, pospreSapienciaData, budgetData, register, errors, controlRegister, projectVinculationSelected, setValueRegister } = useBudgetRoutesCrudData('');


  const convertedOptionsPosPre = pospreSapienciaDataCdp.map((item) => ({
    value: String(item.value),
    name: item.name,
  }));

  const convertedFondo = fundsData.map((item) => ({
    value: String(item.value),
    name: item.name,
  }));
  const loadInfo = () => {
    setFormInfo(formValues);
  };
  useEffect(() => {
    loadInfo();
    console.log(pospreSapienciaDataCdp);

  }, [proyecto, nombreProyecto, fondo, pospre, areaFuncional, centroGestor, div, posicion, valorInicial]);

  const formatToColombianPesos = (value) => {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
    const unformattedValue = value.replace(/[^\d]/g, ''); // Eliminar todos los caracteres no numéricos
    const floatValue = parseFloat(unformattedValue);
    return formatter.format(floatValue);
  };


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

  const handleValorInicialChange = (event) => {
    const unformattedValue = event.target.value.replace(/[^\d]/g, ''); // Eliminar todos los caracteres no numéricos
    setValorInicial(unformattedValue);
  };

  const handleBlur = () => {
    const formattedValue = formatToColombianPesos(valorInicial);
    setValorInicial(formattedValue);
  };





  useEffect(() => {
    //console.log(projectsData);

    const selectedProject = projectsData.find((project) => {
      if (project.value === parseInt(proyecto)) {
        setNombreProyecto(project.name)
        projectsVinculateData.find((area) => {
          if (project['areaFuncional'] === area.functionalAreaId) {
            setAreaFuncional(area.areaFuntional.number)
          }
        }
        );
      }
    });


  }, [proyecto]);

  const fetchData = async () => {
    if (pospreNewV && fondo && proyecto) {
      try {
        const objectSendData = {
          posPreId: parseInt(pospreNewV),
          foundId: parseInt(fondo),
          projectId: parseInt(proyecto),
        };
        const response = await cdpService.getOneRpp(objectSendData);
        setValorInicial(response['balance']);
        setBalance(response['balance'])
        setIdRpp(response['id'])
        console.log(response);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }
  };

  useEffect(() => {

    fetchData()
  }, [pospreNewV, fondo, proyecto])

  return (
    <div className='containerOne'>
      <div className="formulario">
        <div className="grid-form">
          <h2 className="h3-style">{formNumber + 1}. Ruta</h2>
          <h2>Ruta presupuestal</h2>
          <div className="col-4">
            <label>Proyecto*</label>
            <SelectSearch options={projectsData} setter={setProyecto} />
          </div>

          <div className="col-8">
            <label>Nombre proyecto*</label>
            <input type="text" className="estilo-input bgSecondary" value={nombreProyecto} readOnly />
          </div>

          <div className="col-4">
            <label>Fondo*</label>
            <SelectSearch options={fundsData} setter={setFondo} />
          </div>

          <div className="col-4">
            <label>Pospre*</label>
            <SelectSearch options={convertedOptionsPosPre} setter={setPospreNewV} />
          </div>

          <div className="col-4">
            <label>Área funcional*</label>
            <input type="text" className="estilo-input bgSecondary" value={areaFuncional} onChange={handleAreaFuncionalChange} />
          </div>

          <div className="col-4">
            <label>Centro gestor*</label>
            <input type="text" readOnly className="estilo-input bgSecondary" value={centroGestor} onChange={handleCentroGestorChange} />
          </div>

          <div className="col-4">
            <label>DIV*</label>
            <input type="text" readOnly className="estilo-input bgSecondary" value={div} onChange={handleDivChange} />
          </div>

          <div className="col-4">
            <label>Posición*</label>
            <input type="text" readOnly className="estilo-input bgSecondary" value={formNumber + 1} onChange={handlePosicionChange} />
          </div>

          <h3>Importe</h3>

          <div className="col-3">
            <label>Valor inicial*</label>
            <input
              type="text"
              className="estilo-input"
              value={valorInicial}
              onChange={handleValorInicialChange}
              onBlur={handleBlur}
            />
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
