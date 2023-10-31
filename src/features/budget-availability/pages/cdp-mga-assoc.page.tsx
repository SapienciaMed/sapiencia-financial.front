import { ButtonComponent } from "../../../common/components/Form";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import CdpHeadFormComponent from "../components/cdp-head-form.component";
import CdpHeadMgaAssocComponent from "../components/cdp-head-mga-assoc.component";
import CdpMgaAssocFormComponent from "../components/cdp-mga-assoc-form.component";
import { useCdpCrud } from "../hooks/use-cdp";
import { useParams } from "react-router-dom";
import { useCdpMgaAssocCrud } from "../hooks/use-cdp-mga-assoc";


const CdpMgaAssocPage = () => {
    const { id: cdpId } = useParams();
    const { isBtnDisable, onCancel } = useCdpMgaAssocCrud(cdpId);


    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar MGA</div>
                </section>
                <section className="card-user">
                    <CdpHeadMgaAssocComponent isDisabled={true} cdpId={cdpId} />
                </section>
            </div>
            <br />
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">MGA</div>
                </section>
                <CdpMgaAssocFormComponent isDisabled={true} cdpId={cdpId} />

            </div>
            <section className="container-button-bot-2">
                {/* <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{ color: '#533893' }}> $ {totalTransfer} </label>
                </div> */}
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
                        form="transfer-form"
                        disabled={!isBtnDisable}
                    />
                </div>
            </section>
        </div>
    )



}

export default CdpMgaAssocPage;