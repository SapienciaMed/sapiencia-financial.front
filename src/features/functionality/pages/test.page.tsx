import React, { useEffect, useState } from "react";
import { ButtonComponent, InputComponent } from "../../../common/components/Form";

interface IAppProps { }

interface ImportInterface {
    CENTROGESTOR: string;
    FONDO: string;
    NOMBREPROYECTO: string;
    POSICIÓNPRESUPUESTAL: string;
    PROYECTO: string;
    VALORCONTRACRÉDITO: string;
    VALORCRÉDITO: string;
    ÁREAFUNCIONAL: string;
}

function TestPage(props: IAppProps) {
    const [data, setData] = useState([]);

    const handleButton = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setData(constructJSONFromPastedInput(text));
        } catch (error) {
            console.log(error);
        }
    };
    
    let constructJSONFromPastedInput = (pastedInput) => {
        let rawRows = pastedInput.split("\n");
        let headersArray = rawRows[0].split("\t");
        let output = []
        rawRows.forEach((rawRow, idx) => {
            if (idx > 0) {
                let rowObject = {};
                let values = rawRow.split("\t");
                headersArray.forEach((header, idx) => {
                    Reflect.set(rowObject, header.trim().replaceAll(" ", ""), values[idx].trim())
                });
                output.push(rowObject);
            }
        })
        return output;
    }
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <div>
            <ButtonComponent type="button" value="Añadir" action={handleButton} />
            <div>
                {
                    data.map(item => {
                        return (
                            <div key={item} className="card-form" style={{marginBottom: "10px"}}>
                                <InputComponent idInput={"CENTROGESTOR"} typeInput={"text"} value={item.CENTROGESTOR} label={"Centro gestor"} />
                                <InputComponent idInput={"FONDO"} typeInput={"text"} value={item.FONDO} label={"Fondo"}/>
                                <InputComponent idInput={"NOMBREPROYECTO"} typeInput={"text"} value={item.NOMBREPROYECTO} label={"Nombre proyecto"}/>
                                <InputComponent idInput={"POSICIÓNPRESUPUESTAL"} typeInput={"text"} value={item.POSICIÓNPRESUPUESTAL} label={"Posicion presupuestal"}/>
                                <InputComponent idInput={"PROYECTO"} typeInput={"text"} value={item.PROYECTO} label={"Proyecto"}/>
                                <InputComponent idInput={"VALORCONTRACRÉDITO"} typeInput={"text"} value={item.VALORCONTRACRÉDITO !== "" ? item.VALORCONTRACRÉDITO: item.VALORCRÉDITO} label={"Valor Contracredito"}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default React.memo(TestPage);