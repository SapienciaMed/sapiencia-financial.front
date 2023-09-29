import { useParams } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import { usePospreSapienciaData } from "../../hooks/pospre-sapiencia.hook";
import { IBudgetViewPage } from "../../interfaces/Budgets";

function ViewPospreSapiencia( value: IBudgetViewPage ): React.JSX.Element {

    const { actions } = value;

    const { pospre: budgetsId } = useParams();
    const { tableComponentRef,  tableColumnsView, tableActionsView, tableActionEdit } = usePospreSapienciaData({budgetsId, validateAction: 'view'});

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/pospre-sapiencia/get-list-pospresap-vinculation-paginated`}
                columns={tableColumnsView}
                actions={ actions == 'view' ? tableActionsView : tableActionEdit}
                isShowModal={false}
            />
        </div>
    )
    
}

export default ViewPospreSapiencia;