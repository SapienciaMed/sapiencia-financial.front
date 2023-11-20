import { ButtonComponent } from "../../../common/components/Form";
import CdpMgaAssocFormComponent from "../components/cdp-mga-assoc-form.component";
import { useParams } from "react-router-dom";
import { useCdpMgaAssoc } from "../hooks/cdp-mga-assoc.hook";

const CdpMgaAssocPage = () => {
    //const { id: cdpId } = useParams();
    const { id, idRoute } = useParams();
   
    const { control, errors, arrayDataSelect, disableAddButton, arrayMgaAssoc, 
        register, onSubmit, deleteElement, onCancel, handleSaveSubmit,activities } = useCdpMgaAssoc(id,idRoute)

    return (
        <div className="crud-page full-height ">
            <div className='main-page core-container full-height gap-1'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Asociar MGA</div>
                </section>
                
                <CdpMgaAssocFormComponent 
                    control={control}
                    errors={errors}
                    arrayDataSelect={arrayDataSelect}
                    disableAddButton={disableAddButton}
                    arrayMgaAssoc={arrayMgaAssoc}
                    activities={activities}
                    register={register}
                    onSubmit={onSubmit}
                    deleteElement={deleteElement}
                /> 

            </div>
            <section className="container-button-bot-2">
            <div></div>
            <div className="buttons-bot">
                <span
                    className="bold text-center button"
                    onClick={onCancel}
                    onKeyDown={(e) => e.key === 'Enter' && onCancel() }
                    tabIndex={0}
                >
                    Cancelar
                </span>
                <ButtonComponent
                    className="button-main huge hover-three"
                    value="Guardar"
                    type="submit"
                    action={() => handleSaveSubmit() }
                    disabled={disableAddButton}
                />
            </div>
            </section>
        </div>
    )
}

export default CdpMgaAssocPage;
