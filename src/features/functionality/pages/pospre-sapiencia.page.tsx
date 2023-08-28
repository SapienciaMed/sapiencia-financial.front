import { useNavigate, useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { EDirection } from "../../../common/constants/input.enum";
import { usePospreSapienciaData } from "../hooks/pospre-sapiencia.hook";
import TableComponent from "../../../common/components/table.component";
import { Controller } from 'react-hook-form';


function PosPreSapienca(): React.JSX.Element {
    const { pospre } = useParams();
    const navigate = useNavigate();
    const { register, reset, errors, tableComponentRef, tableColumns, tableActions, control,
        showTable, isBtnDisable, setShowTable, onSubmitSearch } = usePospreSapienciaData(pospre);

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
                        <Controller
                            control={control}
                            name={"inputPospreSapiencia"}
                            defaultValue=''
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Pospre sapiencia"
                                        classNameLabel="text-black biggest bold"
                                        direction={EDirection.row}
                                        errors={errors}
                                        onChange={field.onChange}
                                    /> 
                                )
                            }}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                        if(showTable)  {
                            tableComponentRef.current.emptyData();
                            setShowTable(false)
                        }
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                        disabled={!isBtnDisable}
                    />
                </div>
            </FormComponent>

           
            {
                showTable && 
                    <div className="card-form">
                        <TableComponent
                            ref={tableComponentRef}
                            url={`${process.env.urlApiFinancial}/api/v1/pospre-sapiencia/get-paginated`}
                            columns={tableColumns}
                            actions={tableActions} 
                            isShowModal={true}
                            titleMessageModalNoResult='Pospre sapiencia'
                        />
                    </div>
            }
        </div>
    )
}

export default PosPreSapienca;