import { useContext, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";

export function useCdpMgaAssocCrud(cdpId?: string) {

    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false)    

    const onCancel = () => {
        setMessage({
            title: "Cancelar traslado",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            description: '¿Estás segur@ que desea cancelar el traslado?',
            onOk: () => {
                
                setMessage({})
                navigate(-1);
            },
            background: true
        })
    };
    

    return {
        onCancel,
        isBtnDisable
    };
}