import { useNavigate, useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { EDirection } from "../../../common/constants/input.enum";
import { usePospreSapienciaData } from "../hooks/pospre-sapiencia.hook";
import TableComponent from "../../../common/components/table.component";


function PosPreSapienca(): React.JSX.Element {
    const { pospre } = useParams();
    const navigate = useNavigate();
    const { register, reset, errors, tableComponentRef, tableColumns, tableActions, onSubmitSearch } = usePospreSapienciaData(pospre);
    return (
        <div>
            <div className="title-area">
                <div className="text-black extra-large bold">Pospre Sapiencia</div>
            </div>
            <FormComponent action={onSubmitSearch}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black large bold">
                            Consultar Posición Presupuestaria 
                        </label>

                        <div className="title-button text-main biggest" onClick={() => { navigate('./create') }}>
                            Crear Pospre sapiencia<AiOutlinePlusCircle />
                        </div>
                    </div>
                    <div className="pospre-sapiencia-filters">
                        <InputComponent
                            idInput="number"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Pospre sapiencia"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                    />
                </div>
            </FormComponent>
            <div className="card-form">
                <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiFinancial}/api/v1/pospre-sapiencia/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions} 
                    isShowModal={false}/>
            </div>
        </div>
    )
}

export default PosPreSapienca;