import React, { useState, useEffect, useContext } from 'react';
import CdpAssociation from "../components/cdp-head-assoc.component";
import '../../../styles/from-create-cdp.scss';
import CdpPaginator from '../components/cdp-paginator.component';
import FormCreateRutaCDPComponent from '../components/form-create-ruta-cdp.component';
import { useCdpService } from '../hooks/cdp-service';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../../common/contexts/app.context';
import Icons from '../components/Icons';


interface FormInfoType {
    id: number;
    idRppCode: string;
    posicion: string;
    valorInicial: string;
    balance: string;
  }
const CdpAmountAssoc = () => {
    const { setMessage } = useContext(AppContext);
    const { formInfo } = useContext(AppContext);
    const [formCount, setFormCount] = useState(2);
    const [formularios, setFormularios] = useState([{ id: 1 }]);
    const [formHeadInfo, setFormHeadInfo] = useState({})
    const [objectSendData, setObjectSendData] = useState({})
    const cdpService = useCdpService();
    const navigate = useNavigate();
    const [proyectoError, setProyectoError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [amountInfo, setAmountInfo] = useState<FormInfoType>({
        idRppCode: "",
        posicion: "",
        valorInicial: "",
        balance: "",
        id: 0,
      });
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];

    const handleAgregarFormulario = () => {
        const newFormulario = { id: formCount };
        setFormularios([...formularios, newFormulario]);
        setFormCount(formCount + 1);
    };


    const formsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    const currentForms = formularios.slice(indexOfFirstForm, indexOfLastForm);
    const totalForms = formularios.length;
    const totalPages = Math.ceil(totalForms / formsPerPage);
    const handleEliminar = (formNumber) => {
        setFormCount((prevCount) => prevCount - 1);
    };
    useEffect(() => {
        if (Object.keys(formInfo).length > 0) {
            if ('id' in formInfo) {
                const id = typeof formInfo.id === 'number' ? formInfo.id : 0; // Asegura que id sea un número
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
                    const updatedFormularios = [...formularios, { ...formInfo, id: id }]; // Asegura que el objeto tenga la propiedad id
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
        setTimeout(() => {
            setObjectSendData(finalObj)
            console.log(formHeadInfo);

        }, 1000);
    }, [formInfo]);

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
        <h2>Asociar ruta CDP</h2>
        <button onClick={handleAgregarFormulario} className='agregar-ruta'>
          <div className="button-content">
            <Icons />
            <span>Agregar Ruta</span>
          </div>
        </button>
      </div>
            <CdpAssociation
                isDisabled={false}
                setFormHeadInfo={(data) => console.log(data)}
                formSubmitted={false}
            />
            {renderFormsForCurrentPage()}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CdpPaginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

            </div>
        </div>
    );
};

export default CdpAmountAssoc;
