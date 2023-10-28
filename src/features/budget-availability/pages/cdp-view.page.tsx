import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import CdpHeadFormComponent from "../components/cdp-head-form.component";
import { useCdpCrud } from "../hooks/use-cdp";
import { useParams } from "react-router-dom";


const CdpViewPage = () => {
    const { id: cdpId } = useParams();
    const { tableComponentRef, tableColumns,tableActions, cdpFoundSt } = useCdpCrud(cdpId);

    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Visualizar CDP</div>
                </section>
                <section className="card-user">
                    <CdpHeadFormComponent isDisabled={true} cdpId={cdpId}/>
                </section>
            </div>
            <br />
            <div className="card-table gap-0">
                <TableDataPropComponent
                    ref={tableComponentRef}
                    dataTable={Object(cdpFoundSt).amounts}
                    columns={tableColumns}
                    actions={tableActions}
                    isShowModal={true}
                    titleMessageModalNoResult={"No se encontraron registros"}
                    secondaryTitle="CDP"
                />

            </div>
        </div>
    )



}

export default CdpViewPage;