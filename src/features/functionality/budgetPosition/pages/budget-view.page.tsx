import { useParams } from "react-router-dom";
import TabListComponent from "../../../../common/components/tab-list.component";
import { useBudgetView } from "../hooks/budget-view.hook";

function BudgetViewPage() {
    
    const { id, option } = useParams();
    const { tabs, start } = useBudgetView(id, option);
   
    return (
        <div className='main-page'>
            <div className='card-table'>
                <TabListComponent tabs={tabs} start={start}/>
            </div>
        </div>
    )

}

export default BudgetViewPage;