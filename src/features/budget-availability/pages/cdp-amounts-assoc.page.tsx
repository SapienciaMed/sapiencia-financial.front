import React, { useState, useEffect, useContext } from 'react';
import CdpAssociation from "../components/cdp-head-assoc.component";
import '../../../styles/from-create-cdp.scss';
import CdpPaginator from '../components/cdp-paginator.component';
import FormCreateRutaCDPComponent from '../components/form-create-ruta-cdp.component';
import { useCdpService } from '../hooks/cdp-service';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../../common/contexts/app.context';
import Icons from '../components/Icons';
import { v4 as uuidv4 } from 'uuid';

interface FormInfoType {
    id: number;
    idRppCode: string;
    posicion: string;
    valorInicial: string;
    balance: string;
}

interface FormHeadInfo {
    date: string;
    cdpSapConsecutive: string;
    cdpAuroraConsecutive: string;
    contractObject: string;
}

const CdpAmountAssoc = () => {
    const { setMessage } = useContext(AppContext);
    const { formInfo } = useContext(AppContext);
    const [formCount, setFormCount] = useState(2);
    const [formularios, setFormularios] = useState([{ id: 0 }]);
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
    const formsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    const currentForms = formularios.slice(indexOfFirstForm, indexOfLastForm);
    const totalForms = formularios.length;
    const totalPages = Math.ceil(totalForms / formsPerPage);
    const [deleteRouteTwo, setDeleteRouteTwo] = useState(false);
    const { getCdpById } = useCdpService();
    const [dataHead, setDataHead] = useState<FormHeadInfo>({
        date: '',
        cdpSapConsecutive: '',
        cdpAuroraConsecutive: '',
        contractObject: '',
    });
    const [objectFinal, setObjectFinal] = useState([])
    const [idCdp, setIdCdp] = useState(0);
    const [formId, setFormId] = useState(0);


    const handleAgregarFormulario = () => {
        const newFormulario = { id: formCount };
        setFormularios([...formularios, newFormulario]);
        setFormCount(formCount);

        if(!deleteRouteTwo){
            setTimeout(() => {
              handleEliminar(1)
              setDeleteRouteTwo(true);
            }, 500);
          }
    };

    const [cdpPosition, setCdpPosition] = useState(0);

    const handleEliminar = (formNumber) => {
        setFormularios((prevFormularios) =>
          prevFormularios.filter((_, index) => indexOfFirstForm + index !== formNumber)
        );
        setFormCount((prevCount) => prevCount - 1);
      };

    useEffect(() => {
        if (Object.keys(amountInfo).length > 0) {
            if ('id' in amountInfo) {
                const id = typeof amountInfo.id === 'number' ? amountInfo.id : 0; // Asegura que id sea un número
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
                    const updatedFormularios = [...formularios, { ...amountInfo, id: id }]; // Asegura que el objeto tenga la propiedad id
                    setFormularios(updatedFormularios);
                }
            }
        }


        let finalObj = {
            amounts: formularios
        };
        
        setFormId(finalObj.amounts.length);


        setTimeout(() => {
            setObjectSendData(finalObj)
        }, 1000);
    }, [amountInfo]);


    const handleCancel = () => {
        setMessage({
            title: "Cancelar",
            description: "¿Estás segur@ de cancelar?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                //onCancelNew();
                navigate("../");
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
        try {
            const icdArrWithBalanceCheck = objectSendData["amounts"];

            const invalidBalances = icdArrWithBalanceCheck.filter(
                (item) => parseInt(item.valorInicial) >= parseInt(item.balance)
            );

            if (invalidBalances.length !== 0) {
                setMessage({
                    title: "Validar valor inicial",
                    description: "Recuerda que el valor inicial no puede ser mayor o igual al balance disponible de la ruta presupuestal",
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

                const updatedIcdArr = icdArrWithBalanceCheck.map((item) => {
                    const valuesAreValid = Object.values(item).every(value => value !== null && value !== undefined && value !== '');
                
                    if (!valuesAreValid) {
                    return;
                    }
                
                    const { balance, ...rest } = item;
                    return rest;
                });

      

/*                  updatedIcdArr = icdArrWithBalanceCheck.map(({ balance, ...rest }) => rest);
 */
                nuevoObjeto = {
                    ...objectSendData,
                    cdpId: idCdp,
                    amounts: updatedIcdArr.map(({ proyecto, posicion, valorInicial, id, ...rest }) => ({
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
                    description: `¿Estas seguro de guardar la informacion?`,
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    onOk: async () => {
                        try {
                            const response = await cdpService.associateCdpAmounts(nuevoObjeto);
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
                                            navigate("../../");
                                        },
                                        background: true,
                                    });
                                }

                                if (response['operation']['code'] === "FAIL") {
                                    setMessage({
                                        title: "Error al asociar rutas",
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
                        setMessage({});
                    },
                    background: true,
                });
                return;
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

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
            posicionCdp={indexOfLastForm > cdpPosition ? indexOfLastForm+index : cdpPosition + index}
          />
        ));
      };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getCdpById(lastSegment).then((res) => {
            setIdCdp(res.data[0].id);
            setDataHead({
                'date': res.data[0].date,
                'contractObject': res.data[0].contractObject,
                'cdpAuroraConsecutive': res.data[0].consecutive,
                'cdpSapConsecutive': res.data[0].sapConsecutive,
            });

            const amounts = res.data[0].amounts;
            if (amounts && amounts.length > 0) {
                const lastAmount = amounts.length;
                setCdpPosition(lastAmount);
            }
        });
    }, []);
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
                information={dataHead}
            />
            {formularios.length > 0 && (
                <div>
                    {renderFormsForCurrentPage()}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CdpPaginator
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
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

export default CdpAmountAssoc;
