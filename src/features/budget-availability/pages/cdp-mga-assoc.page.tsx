import { ButtonComponent, FormComponent } from "../../../common/components/Form";
import CdpHeadMgaAssocComponent from "../components/cdp-head-mga-assoc.component";
import CdpMgaAssocFormComponent from "../components/cdp-mga-assoc-form.component";
import { useParams } from "react-router-dom";
import { useCdpMgaAssocCrud } from "../hooks/use-cdp-mga-assoc";
import { useCdpMgaAssoc } from "../hooks/cdp-mga-assoc.hook";


const CdpMgaAssocPage = () => {
    const { id: cdpId } = useParams();
    const { isBtnDisable, onCancel } = useCdpMgaAssocCrud(cdpId);

    const { onSubmit } = useCdpMgaAssoc()

    return (
        <div className="crud-page full-height ">
            <div className='main-page core-container full-height gap-1'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar MGA</div>
                </section>
                
                <CdpMgaAssocFormComponent isDisabled={true} cdpId={cdpId} /> 

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
                    form="form-cdp-assoc-mga-save"
                    disabled={!isBtnDisable}
                    />
            </div>
            </section>
        </div>
    )
}

export default CdpMgaAssocPage;
