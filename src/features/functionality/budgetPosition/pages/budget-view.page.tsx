import { useParams } from "react-router-dom";
import TabListComponent from "../../../../common/components/tab-list.component";
import { useBudgetView } from "../hooks/budget-view.hook";

interface IBudgetViewPage{
    budgetsData: string
}
function BudgetViewPage( {budgetsData}: IBudgetViewPage) {
    
    const { id, option } = useParams();
    const { tabs, start } = useBudgetView(id, option, budgetsData );
   
    return (
        <div className='main-page'>
            <div className='card-table'>
                <TabListComponent tabs={tabs} start={start}/>
            </div>
        </div>
    )

}

export default BudgetViewPage;