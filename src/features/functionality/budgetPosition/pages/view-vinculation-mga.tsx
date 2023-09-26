import { useParams } from "react-router-dom";
import TableComponent from "../../../../common/components/table.component";
import { useVinculationMGAData } from "../../hooks/vinculation-mga.hook";

function ViewVinculationMGA(): React.JSX.Element {

    const { id: budgetsId } = useParams();
    const { tableComponentRef, tableColumnsEdit, tableActions } = useVinculationMGAData(budgetsId);

    return(
        <div className="card-form no-box-shadow">
            <TableComponent
                ref={tableComponentRef}
                url={`${process.env.urlApiFinancial}/api/v1/vinculation-mga/get-paginated`}
                columns={tableColumnsEdit}
                actions={tableActions}
                isShowModal={false}
            />
        </div>
    )
    
}

export default ViewVinculationMGA;