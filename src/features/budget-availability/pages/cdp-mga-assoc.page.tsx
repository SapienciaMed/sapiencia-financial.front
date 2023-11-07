import { ButtonComponent } from "../../../common/components/Form";
import CdpMgaAssocFormComponent from "../components/cdp-mga-assoc-form.component";
import { useParams } from "react-router-dom";
import { useCdpMgaAssocCrud } from "../hooks/use-cdp-mga-assoc";


const CdpMgaAssocPage = () => {
    const { id: cdpId } = useParams();
    const { isBtnDisable, onCancel } = useCdpMgaAssocCrud(cdpId); 

    return (
        <div className="crud-page full-height ">
            <div className='main-page core-container full-height gap-1'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar MGA</div>
                </section>
                
                <CdpMgaAssocFormComponent cdpId={cdpId} /> 

            </div>
            <section className="container-button-bot-2">
            <div></div>
            <div className="buttons-bot">
                <span
                    className="bold text-center button"
                    onClick={onCancel}
                >
                    Cancelar
                </span>
                <ButtonComponent
                    className="button-main huge hover-three"
                    value="Guardar"
                    type="submit"
                    // action={() => handleSaveSubmit() }
                    disabled={!isBtnDisable}
                />
            </div>
            </section>
        </div>
    )
}

export default CdpMgaAssocPage;
