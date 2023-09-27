import { useParams } from "react-router-dom";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";
import TableComponent from "../../../../common/components/table.component";
import { usePospreSapienciaData } from "../../hooks/pospre-sapiencia.hook";

interface IViewPospreSapiencia{
    budgetsData: string
}

function ViewPospreSapiencia( {budgetsData}: IViewPospreSapiencia): React.JSX.Element {

    const { id: budgetsId } = useParams();
    const { tableComponentRef,  tableColumnsView, tableActionsView, } = usePospreSapienciaData({budgetsId, validateAction: 'view', budgetsData});

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/pospre-sapiencia/get-list-pospresap-vinculation-paginated`}
                columns={tableColumnsView}
                actions={tableActionsView}
                isShowModal={false}
            />
        </div>
    )
    
}

export default ViewPospreSapiencia;