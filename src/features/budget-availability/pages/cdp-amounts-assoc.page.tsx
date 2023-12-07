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

interface FormHeadInfo {
    date: string;
    cdpSapConsecutive: string;
    cdpAuroraConsecutive: string;
    contractObject: string;
}

const CdpAmountAssoc = () => {
    const { formDataCdpRoute, setFormDataCdpRoute } = useStore();
    const { totalDataRuta, setTotalDataRuta } = useStoreTwo();
    const [formStates, setFormStates] = useState({});
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
    const [countNewFormsSt, setCountNewFormsSt] = useState([])
    const currentForms = countNewFormsSt.slice(indexOfFirstForm, indexOfLastForm);
    const totalForms = countNewFormsSt.length;
   // const [totalPages, setTotalPages] = useState(Math.ceil(totalForms / formsPerPage));
    let totalPages = Math.ceil(totalForms / formsPerPage);
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
    const [dataComplete, setDataComplete] = useState([]);
    const [lastValue, setLastValue] = useState(0);
    const [cdpPosition, setCdpPosition] = useState(0);
    const [indexData, setIndexData] = useState(0)
    /* 
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
        }; */


    
    
    const handleAgregarFormulario = () => {
        let arrData = countNewFormsSt;
          const nextId = formularios.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1;
          const nextId2 = countNewFormsSt.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1;
        console.log("nextID1", nextId)
        console.log("nextID2", nextId2)
    
        let othersParams = {
            "idRppCode": "0",
            "valorInicial": "0",
            "balance": "0",
        }

        const newFormulario = {
            id: nextId2,
            posicion: nextId2, // Igualar posición al ID
            ...othersParams,
        };

        setFormularios([]);
       // const newFormulario = { id: formularios.length > 0 ? formularios.reduce((max, obj) => (obj.id > max ? obj.id : max), 0)+1 : 0 };
        arrData.push(newFormulario)
        setCountNewFormsSt(arrData)
        setTimeout(() => console.log("formularios 2", arrData), 500);
        setFormularios(countNewFormsSt)
        
        console.log(nextId);
        console.log("newF", countNewFormsSt);
        setTimeout(() => {
              //setDeleteRouteTwo(true);
            }, 500);
    };

/*     useEffect(()=>{
        handleAgregarFormulario()
    },[]) */


    const handleEliminar = async (formNumber) => {
        console.log("formNumber",formNumber);
        console.log("firstIndex",indexOfFirstForm);
        console.log("counTNewSt",countNewFormsSt);
        console.log("currentPage",currentPage);
        console.log("currentForms",currentForms);
    
        // Remove form from countNewFormsSt
 /*        setCountNewFormsSt((prevFormularios) =>
            prevFormularios.filter((_, index) => indexOfFirstForm + index !== formNumber)
        );
    */
   let newSize = 0;
        setCountNewFormsSt((prevFormularios) => {
            // Usa filter para excluir el formulario con el id correspondiente
            const updatedFormularios = prevFormularios.filter((data) => data.id !== formNumber);
            
            // Imprime el array actualizado
            console.log("counTNewStSSQ AC", updatedFormularios);
            newSize = updatedFormularios.length;
            return updatedFormularios;
          });
          
    
        // Update form count
        setFormCount((prevCount) => prevCount - 1);
    
        // Remove form from objectSendData
    /*     setObjectSendData((prevFormularios) =>
            prevFormularios.filter((_, index) => indexOfFirstForm + index !== formNumber)
        ); */

   
      let formulaTotalData = newSize / totalPages;
      console.log("este es el numero",formulaTotalData);
      console.log("esas",newSize);
      
      if (currentPage > 1 ) {
        if (formulaTotalData % 1 === 0) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            console.log("Es un número float");
          }
    
        }
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

        console.log(objectSendData);
        
        return;
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
                                            navigate("../");
                                            setMessage({});
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

    /* const renderFormsForCurrentPage = () => {
        const indexOfLastForm = currentPage * formsPerPage;
        const indexOfFirstForm = indexOfLastForm - formsPerPage;
        const foundObject = totalDataRuta.find(obj => obj.id === indexOfFirstForm);
        const sizeForms = formularios.length;
        console.log(formularios.length);
        console.log(indexOfFirstForm);
        console.log(indexOfLastForm);
        console.log(cdpPosition);
      

        return formularios.slice(indexOfFirstForm, indexOfLastForm).map((_, index) => (
          
          <FormCreateRutaCDPComponent
            key={indexOfFirstForm + index}
            isRequired={indexOfFirstForm + index === 0}
            formNumber={indexOfFirstForm + index}
            handleEliminar={handleEliminar}
            formSubmitted={formSubmitted}
            amountInfo={amountInfo}
            setAmountInfo={setAmountInfo}
           // posicionCdp = {(cdpPosition >= 0 && cdpPosition <= 2) ? cdpPosition + index : (indexOfLastForm > cdpPosition ? indexOfLastForm + index : cdpPosition + index)}
            posicionCdp = { cdpPosition + (sizeForms - 1)}
            datasFounds={foundObject}
          />
          ));
        }; */


    let counter = 0;
    const renderFormsForCurrentPage = () => {

        const indexOfLastForm = currentPage * formsPerPage;
        const indexOfFirstForm = indexOfLastForm - formsPerPage;
        return countNewFormsSt.slice(indexOfFirstForm, indexOfLastForm).map((form, index) => {
            const currentId = form.id;
            const foundObject = totalDataRuta.find(obj => obj.id === currentId);

            return (
                <FormCreateRutaCDPComponent
                    key={currentId}
                    isRequired={false}
                    formNumber={indexOfFirstForm + (countNewFormsSt.length - 1)}
                    handleEliminar={() => handleEliminar(currentId)}
                    formSubmitted={formSubmitted}
                    amountInfo={amountInfo}
                    setAmountInfo={setAmountInfo}
                    posicionCdp={0}
                    datasFounds={foundObject}
                    countAssoc={currentPage == 1 ? cdpPosition + index + 1 :
                        cdpPosition + index + 1 + (currentPage - 1) * formsPerPage}
                />
            );
        });
    };

    

   /*  const renderFormsForCurrentPage = () => {
        const indexOfLastForm = currentPage * formsPerPage;
        const indexOfFirstForm = indexOfLastForm - formsPerPage;
      
        console.log({ cdpPosition });
        console.log(formularios);
      
        return formularios.map((form, index) => {
          const currentId = form.id;
      
          if (index >= indexOfFirstForm && index < indexOfLastForm) {
            const foundObject = totalDataRuta.find(obj => obj.id === currentId);
      
            return (
              <FormCreateRutaCDPComponent
                key={currentId}
                isRequired={false}
                formNumber={index + 1}
                handleEliminar={() => handleEliminar(currentId)}
                formSubmitted={formSubmitted}
                amountInfo={amountInfo}
                setAmountInfo={setAmountInfo}
                posicionCdp={0}
                datasFounds={foundObject}
                countAssoc={currentPage === 1 ? cdpPosition + index + 1 : cdpPosition + index + 1 + (currentPage - 1) * formsPerPage}
              />
            );
          }
      
          return null; // Devuelve null para los formularios que no están en el rango de la página actual
        });
      }; */
      






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
        console.log(dataComplete);


    }, [formDataCdpRoute]);



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
            const lastAmount = amounts.length;
            setCdpPosition(lastAmount);
            if (amounts && amounts.length > 0) {
                const lastAmount = amounts.length;
                setCdpPosition(lastAmount);
            } else if (amounts.length === 0) {
                setCdpPosition(0);
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
            {countNewFormsSt.length > 0 && (
            
                
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
