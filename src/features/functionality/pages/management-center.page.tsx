import { FormComponent, InputComponent, SelectComponent, ButtonComponent} from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useManagementCenterData } from "../hooks/management-center-hook";
import {AiOutlinePlusCircle} from "react-icons/ai";
interface IAppProps { }

function ManagementCenterPage(props: IAppProps): React.JSX.Element {
const { tableActions, tableColumns, tableComponentRef,navigate, onSubmit, register, errors, setValueRegister, reset, typesTransfersSelected, setTypesTransfersSelected,typesTransfersData } = useManagementCenterData();
return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area"> 
                        <label className="text-black biggest bold">
                            Consultar Traslado
                        </label>
                        <div className="title-button text-three biggest">
                        <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./create') }}> Crear Pospre</span>
                           {<AiOutlinePlusCircle size={20} color="533893" />}
                        </div>
                    </div>
                 
                    <div className="funcionality-filters-container">
                        <SelectComponent
                            idInput="entity"
                            className="select-basic"
                            register={register}
                            setValueRegister={setValueRegister}
                            errors={errors}
                            label="Entidad CP"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            data={typesTransfersData}
                            stateProps={{ state: typesTransfersSelected, setState: setTypesTransfersSelected }}
                        />
                        <InputComponent
                            idInput="actSapiencia"
                            className="input-basic"
                            typeInput="number"
                            register={register}
                            label="Ejercicio"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                        <InputComponent
                            idInput="actDistrict"
                            className="input-basic"
                            typeInput="number"
                            register={register}
                            label="Posición presupuestaria"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                         <InputComponent
                            idInput="denomination"
                            className="input-basic"
                            typeInput="string"
                            register={register}
                            label="Denominación"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                            reset();
                            setTypesTransfersSelected(null);
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
                    url={`${process.env.urlApiFinancial}/api/v1/budgets/get-paginated`}
                    columns={tableColumns}
                    actions={tableActions}
                    isShowModal={false}
                />
            </div>
        </div>
    )
}
export default ManagementCenterPage;