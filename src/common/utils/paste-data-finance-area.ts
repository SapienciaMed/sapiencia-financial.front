import { IPasteDataFinanceArea } from "../../features/managementCenter/transfer/interfaces/TypesTranfersInterfaces";
import { AddValidHeaders, AddValidHeadersTransfer } from "../constants/doc.enum";
import { generarIdAleatorio } from "./randomGenerate";


export const PasteDataFinanceArea = async ({ setIsSearchByName, setMessage, setDataPaste, arrayDataSelect, validationIn = 'adicion' }: IPasteDataFinanceArea) => {
    try {
        const pastedInput = await navigator.clipboard.readText()
        constructJSONFromPastedInput({ arrayDataSelect, pastedInput, setMessage, setDataPaste, validationIn });
    } catch (error) {
        console.log(error);
    }
}

const constructJSONFromPastedInput = ({ pastedInput, setMessage, setDataPaste, arrayDataSelect, validationIn }: IPasteDataFinanceArea) => {
    let rawRows = pastedInput.split("\n");
    let headersArray = rawRows[0].split("\t");
    let output = [];

    const validHeaders = validationIn === 'traslado' ? AddValidHeadersTransfer : AddValidHeaders;
    const isAllHeadersValid = headersArray.every(value => validHeaders.includes(value));
    const isLengthEqual = headersArray.length === validHeaders.length;
    
    let dataMovementByTransfer = [];
    let dataMovementOrigin = [];
    let dataMovementDestiny = [];
    let countTransfer=1;
    
    isAllHeadersValid && isLengthEqual ?
        rawRows.forEach((rawRow, idx) => {
            if (rawRow != '') {
                if (idx > 0) {
                    let rowObject = {};
                    let values = rawRow.split("\t");
                    headersArray.forEach((header, idx) => {
                        Reflect.set(rowObject, header.trim().replaceAll(" ", ""), values[idx].trim())
                    });

                    //Realizar logica para pegar ya sea un origen o un destino
                    const valorContracredito = parseFloat(Object(rowObject).VALORCONTRACRÉDITO) || 0;
                    const valorCredito = parseFloat(Object(rowObject).VALORCRÉDITO) || 0;
                    
                    if(valorContracredito>0 && valorCredito==0){
                        Object(rowObject).typeTransfer="Origen"
                        
                    }else if(valorContracredito==0 && valorCredito>0){
                        Object(rowObject).typeTransfer="Destino"
                    }

                    if(validationIn === 'traslado'){
                        
                            if(idx==1){
                                Object(rowObject).transferId=countTransfer;
                                dataMovementByTransfer.push({data:[rowObject]})
                            }else{

                                /* if(countTransfer==1){

                                }else{
                                
                                } */

                                    let lastObj = dataMovementByTransfer[countTransfer-1].data[dataMovementByTransfer[countTransfer-1].data.length-1]
                                    if(lastObj.typeTransfer == 'Origen' && lastObj.typeTransfer == Object(rowObject).typeTransfer ){
                                        dataMovementByTransfer[countTransfer-1].data.push(rowObject)
                                    }else if(lastObj.typeTransfer == 'Destino' && Object(rowObject).typeTransfer=='Origen'){
                                        // se crea un nuevo traslado
                                        // validar que los totales del array coinciden
                                        if(true){
                                            countTransfer +=1;
                                            dataMovementByTransfer.push({data:[rowObject]})
                                        }else{
                                            dataMovementByTransfer = []
                                            return
                                        }

                                    }else{
                                        // se guarda en el mismo traslado
                                        dataMovementByTransfer[0].data.push(rowObject)
                                    }

                                    //console.log({lastObj})

                                    //dataMovementByTransfer[0].data.push(rowObject)
                                    
                                    
                                    

                                
                               



                            }

                            


                        output.push(rowObject)
                    }else{
                        output.push(rowObject)
                    } 
                    
                }
            }
        })
        :
        setMessage({
            title: "Validación de datos",
            description: "Se ha encontrado un error en los datos, valida: incluir titulos o sin datos vacios",
            show: true,
            OkTitle: "Aceptar",
        })

        console.log({dataMovementByTransfer})  

    const mapOutputItem = (item, arrayDataSelect, validationIn) => {
        const commonFields = {
            isPaste: true,
            cardId: generarIdAleatorio(20),
            managerCenter: item.CENTROGESTOR,
            projectId: (arrayDataSelect.functionalArea.find(e => e.name == item.PROYECTO))?.id,
            functionalArea: Object(arrayDataSelect.functionalArea.filter(e => e.value != null).find((e) => e.area[0]?.name == item.ÁREAFUNCIONAL))?.area[0]?.id,
            funds: (arrayDataSelect.funds.filter(e => e.value != null).find(e => e.name == item.FONDO))?.id,
            projectName: item.NOMBREPROYECTO,
        };
        
        if (validationIn == 'traslado') {
            return {
            ...commonFields,
                value: item.VALORCONTRACRÉDITO == '-' ? '0' : item.VALORCONTRACRÉDITO.replaceAll('.', ''),
                posPre: (arrayDataSelect.posPre.filter(e => e.value != null).find(e => e.name == item.POSICIÓNPRESUPUESTAL))?.id,
            };
        }else {
            return {
            ...commonFields,
                value: item.VALOR == '-' ? '0' : item.VALOR.replaceAll('.', ''),
                posPre: (arrayDataSelect.posPre.filter(e => e.value != null).find(e => e.name == item.POSPRE))?.id,
            };
        }
    };

    try {
        if (output.length > 0) {
            const mappedOutput = output.map((item) => {
              return mapOutputItem(item, arrayDataSelect, validationIn);
            });
        
            setDataPaste(mappedOutput);
        }
    } catch (error) {
        setMessage({
            title: "Validación de datos",
            description: "Se ha encontrado un error en los datos, verifiqué que no tenga campos vacios o valores invalidos",
            show: true,
            OkTitle: "Aceptar",
        })
    }

}

