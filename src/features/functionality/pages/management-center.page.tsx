import { BiPlusCircle } from "react-icons/bi";
import { FormComponent, InputComponent, SelectComponent, ButtonComponent} from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
import { useManagementCenterData } from "../hooks/management-center-hook";
import {AiOutlinePlusCircle} from "react-icons/ai";
interface IAppProps { }

function ManagementCenterPage(props: IAppProps): React.JSX.Element {
const { tableActions, tableColumns, tableComponentRef, navigate, onSubmit, register, errors, reset, typesTransfersData, controlRegister } = useManagementCenterData();
return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area"> 
                        <label className="text-black biggest bold">
                            Consultar Traslado
                        </label>
                        <div className="title-button text-three large" onClick={() => { navigate('./create') }}> Crear Pospre <BiPlusCircle/> </div>
                    </div>
                 
                    <div className="funcionality-filters-container">
                        <SelectComponent
                            idInput="entity"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Entidad CP"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            data={typesTransfersData}
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
                <div className="container-button-core mt-24px">
                    <div className="display-justify-space-between">
                        <ButtonComponent
                            form='useQueryForm'
                            value="Limpiar campos"
                            type="button"
                            className="button-clean-fields bold"
                            action={() => { reset() }}
                        />
                        <ButtonComponent
                            className="button-search"
                            value="Buscar"
                            type="submit"
                        />
                    </div>                
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