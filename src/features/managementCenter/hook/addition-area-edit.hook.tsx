import { useEffect, useState } from "react";
import { useAdditionsTransfersService } from "./additions-transfers-service.hook";
import { EResponseCodes } from '../../../common/constants/api.enum';
import { IData } from "../interfaces/Additions";
import { useParams } from "react-router-dom";
export function useAdditionAreaEdit() {
    
    const { id: idMovement } = useParams();    

    const { showAdition } = useAdditionsTransfersService();    
   
    const [aditionData, setAditionData] = useState<IData>(null);   
    
    useEffect(() => {        
        if (idMovement) {
            showAdition(idMovement).then((response) => {
                if (response.operation.code === EResponseCodes.OK) {
                    setAditionData(response.data);               
                }
            });          
        }        
    }, []);   
    
   
    return {
        aditionData
    };

}