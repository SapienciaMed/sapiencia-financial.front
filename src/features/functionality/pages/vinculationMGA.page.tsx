import { useNavigate, useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { EDirection } from "../../../common/constants/input.enum";
import { useVinculationMGAData } from "../hooks/vinculation-mga.hook";
import TableComponent from "../../../common/components/table.component";
import { useEffect } from "react";


function VinculationMGA(): React.JSX.Element {
    const { pospre } = useParams();
    const navigate = useNavigate();
    const { register, reset, errors, tableComponentRef, tableColumns, loadTableData ,onSubmit ,tableActions, vinculateActivities } = useVinculationMGAData(pospre);
    
     useEffect(() => {
         if(Number(pospre)) loadTableData({budgetId: Number(pospre)});
     }, [pospre])
    return (
        <div>
            <div className="title-area">
                <div className="text-black extra-large bold">Vinculación MGA</div>
            </div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black large bold">
                            Consultar Vinculación MGA
                        </label>
                    </div>
                    <div className="funcionality-filters-container">
                        <InputComponent
                            idInput="number"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Código MGA"
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
            
            <div className="card-form">
                <TableComponent
                    ref={tableComponentRef}
                    url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions} 
                    isShowModal={false}/>
            </div>
            <div className="container-button-bot">
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={() => { navigate("./../../../"); }}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="button"
                        action={()=>{vinculateActivities(true)}}
                    />
                </div>
            </div>
            </FormComponent>
        </div>
    )
}

export default VinculationMGA;