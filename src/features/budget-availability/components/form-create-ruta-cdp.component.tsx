import React, { useState, useEffect, useContext } from 'react';
import '../../../styles/from-create-cdp.scss';
import { useCdpService } from '../hooks/cdp-service';
import SelectSearch from './select-create-cdp.component';
import { AppContext } from '../../../common/contexts/app.context';
import { useBudgetRoutesCrudData } from '../../budget-routes/hooks/budget-routes-crud.hook';
import { Grid } from '@mui/material';
import useStore from '../../../store/store';
import useStoreTwo from '../../../store/storeTwo';

export interface FormInfoType {
  idRppCode: string;
  posicion: string;
  valorInicial: string;
  balance: string;
  id: number;
}

export interface FormInfoData {
  proyecto: string;
  nombreProyecto: string;
  fondo: string;
  pospre: string;
  posicion: string;
  valorInicial: string;
  idRpp: string;
}

interface FormularioProps {
  isRequired?: boolean;
  formNumber: number;
  handleEliminar: (formNumber: number) => void;
  formSubmitted?: boolean;
  setAmountInfo: React.Dispatch<React.SetStateAction<FormInfoType>>;
  amountInfo: FormInfoType;
  posicionCdp?: number;
  datasFounds: any; 
}



const FormCreateRutaCDPComponent: React.FC<FormularioProps> = ({datasFounds, formSubmitted, isRequired = false, formNumber, handleEliminar, setAmountInfo, amountInfo, posicionCdp }) => {
  const { setFormInfo, formInfo } = useContext(AppContext);
  const cdpService = useCdpService();
  const [proyecto, setProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [fondo, setFondo] = useState('');
  const [pospre, setPospre] = useState('0');
  const [pospreNewV, setPospreNewV] = useState('');
  const [posPre1, setPosPre1] = useState();
  const [areaFuncional, setAreaFuncional] = useState('');
  const [centroGestor, setCentroGestor] = useState('91500000');
  const [div, setDiv] = useState('SAPI');
  const [posicion, setPosicion] = useState('1');
  const [valorInicial, setValorInicial] = useState('0');
  const [balance, setBalance] = useState('0');
  const [idRpp, setIdRpp] = useState('0');
  const { setMessage } = useContext(AppContext);
  const { formDataCdpRoute, setFormDataCdpRoute } = useStore();
  const { totalDataRuta } = useStoreTwo();
  const [arrAmounts, setArrAmounts] = useState([])


  const [formInfoComponent, setFormInfoComponent] = useState<FormInfoData>({
    proyecto: "",
    nombreProyecto: "",
    fondo: "",
    pospre: "",
    posicion: "",
    valorInicial: "",
    idRpp: "",
  });

  const onDeleteClick = () => {
    handleEliminar(formNumber);
  };

  const formValues = {
    idRppCode: idRpp,
    posicion: posicion,
    valorInicial: valorInicial,
    id: Number(formNumber),
    balance: balance,
  };

  const { pospreSapienciaDataCdp, projectsVinculateData, projectsData, fundsData, pospreSapienciaData, budgetData, register, errors, controlRegister, projectVinculationSelected, setValueRegister } = useBudgetRoutesCrudData('');

  const convertedOptionsPosPre = pospreSapienciaDataCdp.map((item) => ({
    value: String(item.value),
    name: item.name,
  }));

  const renderedFormNumber = (posicionCdp && posicionCdp !== 0) ?
    (formNumber > posicionCdp ? formNumber : posicionCdp) :
    formNumber;

  const validateField = (field) => {
    if (formSubmitted && !field) {

      return 'campo-obligatorio';
    }
    return '';
  };

  const loadInfo = () => {
    let arrInfo = [];
    setAmountInfo((prevAmountInfo) => ({
      ...prevAmountInfo,
      idRppCode: idRpp,
      posicion: posicion,
      valorInicial: valorInicial,
      id: Number(formNumber),
      balance: balance,
    }));

    setFormInfoComponent((dataInfo) => ({
      ...dataInfo,
      proyecto, nombreProyecto, fondo, pospre, posicion, valorInicial, idRpp, id: formNumber
    }));


    if (arrInfo && arrInfo.length > 0) {
      const exists = arrInfo.some(obj => obj.id === formNumber);
      if (!exists) {
        const newObj = {
          proyecto,
          nombreProyecto,
          fondo,
          "pospre": pospreNewV,
          posicion,
          valorInicial,
          idRpp,
          areaFuncional,
          id: renderedFormNumber
        };
       
        
        arrInfo.push(newObj);
        setFormDataCdpRoute([...arrInfo]); // Create a new array with the updated object
        localStorage.setItem('infoImporter', JSON.stringify(formInfoComponent));
      } else {
        console.log(`Ya existe un objeto con id ${formNumber} en arrInfo.`);
      }
    } else {
      const newObj = {
        proyecto,
        nombreProyecto,
        fondo,
        "pospre": pospreNewV,
        posicion,
        valorInicial,
        idRpp,
        areaFuncional,
        id: formNumber
      };
      arrInfo.push(newObj);
      setFormDataCdpRoute([...arrInfo]); // Create a new array with the updated object
      localStorage.setItem('infoImporter', JSON.stringify(formInfoComponent));
    }

  };

  useEffect(() => {
    loadInfo();
  }, [proyecto, nombreProyecto, fondo, pospreNewV, posicion, valorInicial, idRpp]);


  /*   useEffect(() => {
      if (formDataCdpRoute.length > 0) {
        const currentFormData = formDataCdpRoute.find((item) => item.id === formNumber);
    
        if (currentFormData) {
          setProyecto(currentFormData.proyecto);
          setNombreProyecto(currentFormData.nombreProyecto);
          setFondo(currentFormData.fondo);
          setPospreNewV(currentFormData.pospreNewV);
          setAreaFuncional(currentFormData.areaFuncional);
          setCentroGestor(currentFormData.centroGestor);
          setDiv(currentFormData.div);
          setPosicion(currentFormData.posicion);
          setValorInicial(currentFormData.valorInicial);
          setBalance(currentFormData.balance);
          setIdRpp(currentFormData.idRppCode);
        }
      }
    
      console.log(formDataCdpRoute);
    }, [formDataCdpRoute, formNumber]); */


  const formatToColombianPesos = (value) => {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
    const unformattedValue = value.replace(/[^\d]/g, '');
    const floatValue = parseFloat(unformattedValue);
    return formatter.format(floatValue);
  };

  const handleProyectoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProyecto = event.target.value;
    setProyecto(selectedProyecto);
  };

  const handleNombreProyectoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let arrName = event.target.value.split('-');
    setNombreProyecto(arrName[2]);
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
    const unformattedValue = event.target.value.replace(/[^\d]/g, '');
    setValorInicial(unformattedValue);
  };

  const handleBlur = () => {
    const formattedValue = formatToColombianPesos(valorInicial);
    setValorInicial(formattedValue);
  };

  useEffect(() => {
    projectsData.find((project) => {
      if (project.value === parseInt(proyecto)) {
        let arrName = project['nameProject'].split('-');
        setNombreProyecto(arrName[1]);
        projectsVinculateData.find((area) => {
          if (project['areaFuncional'] === area.functionalAreaId) {
            setAreaFuncional(area.areaFuntional.number);
          }
        });
  
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
        if (typeof (response) === "object") {
          let totalAmountsAssoc = parseFloat(response['totalIdc']);
          let balanceFloat = parseFloat(response['balance']).toString().split('.');
          let parteEntera = parseInt(balanceFloat[0]);
          let totalAmountAvalible = parteEntera - totalAmountsAssoc;
          setValorInicial(totalAmountAvalible.toString());
          setBalance(totalAmountAvalible.toString());
          let tryJsonInfo = JSON.stringify(response);
          tryJsonInfo = JSON.parse(tryJsonInfo)['id'].toString();
          setIdRpp(tryJsonInfo);
          const updatedFormInfo = {
            idRppCode: tryJsonInfo,
            posicion: posicion,
            valorInicial: totalAmountAvalible.toFixed(2),
            id: Number(formNumber),
            balance: totalAmountAvalible.toFixed(2),
          };

          setAmountInfo(updatedFormInfo);
        } else {
          setMessage({
            title: "!No hay datos relacionados!",
            description: "No encontramos una ruta presupuestal con los datos que proporcionaste, intentalo de otra vez con nuevos datos",
            show: true,
            OkTitle: "cerrar",
            onOk: () => {
              setMessage({});
            },
            background: true,
          });

          setValorInicial('0')
          return;
        }

      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [pospreNewV, fondo, proyecto]);


  useEffect(() => {
    if (datasFounds && datasFounds !== undefined) {
      setProyecto(datasFounds.proyecto);
      setNombreProyecto(datasFounds.nombreProyecto);
      setFondo(datasFounds.fondo);
      setPospreNewV(datasFounds.pospre);
      setPosicion(datasFounds.posicion);
      setValorInicial(datasFounds.valorInicial);
      setIdRpp(datasFounds.idRpp);
      setAreaFuncional(datasFounds.areaFuncional);
    }

  }, [])

  return (
    <div className='containerOne'>
      <div className="formulario">
        <div>
          <h2 className="h3-style" style={{ flex: 1 }}>
            {renderedFormNumber + 1}. Ruta
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!isRequired && (
              <button
                className="agregar-btn btn-delete"
                onClick={onDeleteClick}
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'transparent',
                  color: 'red',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
        <div className="grid-form">
          <h2>Ruta presupuestal</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Proyecto <span>*</span></label>
                <SelectSearch defaultValue={parseInt(proyecto)} style={{ border: formSubmitted && !proyecto ? '1px solid red' : '1px solid #ccc' }} options={projectsData} setter={setProyecto} />
                {formSubmitted && !proyecto && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
              <div className={`col-8`}>
                <label>Nombre proyecto <span>*</span></label>
                <input
                  type="text"
                  style={{ border: formSubmitted && !nombreProyecto ? '1px solid red' : 'none' }}
                  className={`estilo-input bgSecondary ${validateField(nombreProyecto)}`}
                  value={nombreProyecto}
                  onChange={handleNombreProyectoChange}
                  readOnly
                />
                {formSubmitted && !nombreProyecto && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Fondo <span>*</span></label>
                <SelectSearch defaultValue={fondo} style={{ border: formSubmitted && !fondo ? '1px solid red' : '1px solid #ccc' }} options={fundsData} setter={setFondo} />
                {formSubmitted && !fondo && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Pospre <span>*</span></label>
                <SelectSearch defaultValue={pospreNewV} style={{ border: formSubmitted && !pospreNewV ? '1px solid red' : '1px solid #ccc' }} options={convertedOptionsPosPre} setter={setPospreNewV} />
                {formSubmitted && !pospreNewV && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Área funcional <span>*</span></label>
                <input style={{ border: formSubmitted && !areaFuncional ? '1px solid red' : 'none' }} type="text" className={`estilo-input bgSecondary ${validateField(areaFuncional)}`} value={areaFuncional} onChange={handleAreaFuncionalChange} />
                {formSubmitted && !areaFuncional && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Centro gestor <span>*</span></label>
                <input type="text" readOnly className={`estilo-input bgSecondary ${validateField(centroGestor)}`} value={centroGestor} onChange={handleCentroGestorChange} />
                {formSubmitted && !centroGestor && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>DIV <span>*</span></label>
                <input type="text" readOnly className={`estilo-input bgSecondary ${validateField(div)}`} value={div} onChange={handleDivChange} />
                {formSubmitted && !div && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <div className={`col-4`}>
                <label>Posición <span>*</span></label>
                <input type="text" readOnly className={`estilo-input bgSecondary`} value={renderedFormNumber + 1} onChange={handlePosicionChange} />
                {formSubmitted && !(renderedFormNumber + 1) && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <h3>Importe</h3>
              <div className={`col-3 ${validateField(valorInicial)}`}>
                <label>Valor inicial <span>*</span></label>
                <input
                  type="text"
                  className={`estilo-input ${validateField(valorInicial)}`}
                  value={valorInicial}
                  onChange={handleValorInicialChange}
                //onBlur={handleBlur}
                />
                {formSubmitted && !valorInicial && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
              </div>
            </Grid>
          </Grid>
        </div>

      </div>
    </div>
  );
};

export default FormCreateRutaCDPComponent;
