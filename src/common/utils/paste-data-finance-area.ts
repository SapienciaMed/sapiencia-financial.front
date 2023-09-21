import { IPasteDataFinanceArea } from "../../features/managementCenter/transfer/interfaces/TypesTranfersInterfaces";
import { AddValidHeadersTransfer } from "../constants/doc.enum";
import { generarIdAleatorio } from "./randomGenerate";


export const PasteDataFinanceArea = async ({ setIsSearchByName, setMessage, setDataPaste, arrayDataSelect, isResetOutput }: IPasteDataFinanceArea) => {
    try {
        const pastedInput = await navigator.clipboard.readText()
        return constructJSONFromPastedInput({ arrayDataSelect, pastedInput, isResetOutput, setMessage, setDataPaste });
    } catch (error) {
        console.log(error);
    }
}

const constructJSONFromPastedInput = ({ pastedInput, setMessage, setDataPaste, arrayDataSelect, isResetOutput }: IPasteDataFinanceArea) => {
    let rawRows = pastedInput.split("\n");
    let headersArray = rawRows[0].split("\t");
    let output = [];

    const validHeaders = AddValidHeadersTransfer 
    const isAllHeadersValid = headersArray.every(value => validHeaders.includes(value));
    const isLengthEqual = headersArray.length === validHeaders.length;
    
    let dataMovementByTransfer = [];
    let dataMovementOrigin = [];
    let dataMovementDestiny = [];
    let countTransfer=1;
    
    let valorContracredito = 0;
    let valorCredito = 0;

    isAllHeadersValid && isLengthEqual ?
        rawRows.forEach((rawRow, idx) => {
            if (rawRow != '') {
                if (idx > 0) {
                    let rowObject = {};
                    let values = rawRow.split("\t");
                    headersArray.forEach((header, idx) => {
                        Reflect.set(rowObject, header.trim().replaceAll(" ", ""), values[idx].trim())
                    });
 
                    valorContracredito = parseFloat(Object(rowObject).VALORCONTRACRÉDITO.replaceAll('.', '')) || 0;
                    valorCredito = parseFloat(Object(rowObject).VALORCRÉDITO.replaceAll('.', '')) || 0; 
                    if(valorContracredito > 0 && valorCredito == 0 ){
                        Object(rowObject).typeTransfer="Origen"
                        dataMovementOrigin.push(rowObject)
                    }else if(valorContracredito == 0 && valorCredito > 0 ){
                        Object(rowObject).typeTransfer="Destino"
                        dataMovementDestiny.push(rowObject)
                    }
                    let moveToSave = {
                        idCard: generarIdAleatorio(20),
                        type : Object(rowObject).typeTransfer,
                        managerCenter : Object(rowObject).CENTROGESTOR, 
                        projectId :(arrayDataSelect.functionalArea.find(e => e.name == Object(rowObject).PROYECTO))?.id,
                        fundId : (arrayDataSelect.funds.filter(e => e.value != null).find(e => e.name == Object(rowObject).FONDO))?.id, 
                        budgetPosition : (arrayDataSelect.posPre.filter(e => e.value != null).find(e => e.name == Object(rowObject).POSICIÓNPRESUPUESTAL))?.id,
                        value :Object(rowObject).typeTransfer === 'Origen' ? valorContracredito : valorCredito,
                        nameProject: Object(rowObject).NOMBREPROYECTO,
                        // transferId: countTransfer
                    }
                    
                    if(idx == 1 ){
                        dataMovementByTransfer.push({
                            id: generarIdAleatorio(20),
                            data:[moveToSave]
                        })
                    }else{
                            let lastObj = dataMovementByTransfer[countTransfer-1].data[dataMovementByTransfer[countTransfer-1].data.length-1]
                            if(lastObj.type == 'Origen' && lastObj.type == Object(moveToSave).type ){
                                dataMovementByTransfer[countTransfer-1].data.push(moveToSave)
                            }else if(lastObj.type == 'Destino' && Object(moveToSave).type=='Origen'){
                                    countTransfer +=1;
                                    dataMovementByTransfer.push({
                                        id: generarIdAleatorio(20),
                                        data:[moveToSave]
                                    })
                            }else{
                                dataMovementByTransfer[countTransfer-1].data.push(moveToSave)
                            }
                    }
                    output.push(rowObject)
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

    const mapOutputItem = (item, arrayDataSelect) => {
        const commonFields = {
            isPaste: true,
            cardId: generarIdAleatorio(20),
            managerCenter: item.CENTROGESTOR,
            projectId: (arrayDataSelect.functionalArea.find(e => e.name == item.PROYECTO))?.id,
            functionalArea: Object(arrayDataSelect.functionalArea.filter(e => e.value != null).find((e) => e.area[0]?.name == item.ÁREAFUNCIONAL))?.area[0]?.id,
            funds: (arrayDataSelect.funds.filter(e => e.value != null).find(e => e.name == item.FONDO))?.id,
            projectName: item.NOMBREPROYECTO,
            value: item.VALORCONTRACRÉDITO == '-' ? item.VALORCRÉDITO.replaceAll('.', '') : item.VALORCONTRACRÉDITO.replaceAll('.', ''),
            creditValue: item.VALORCRÉDITO == '-' ? '0' : item.VALORCRÉDITO.replaceAll('.', ''),
            posPre: (arrayDataSelect.posPre.filter(e => e.value != null).find(e => e.name == item.POSICIÓNPRESUPUESTAL))?.id,
            typeTransfer: item.typeTransfer
        };
        return {
            ...commonFields,
        };
    };

    try {
        if (output.length > 0) {
            const mappedOutput = output.map((item) => mapOutputItem(item, arrayDataSelect))
            setDataPaste(mappedOutput);
            return dataMovementByTransfer
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

