import { useEffect, useState } from "react";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { useWidth } from "../../../common/hooks/use-width";
import CdpHeadFormComponent from "../components/cdp-head-form.component";
import { useCdpCrud } from "../hooks/use-cdp";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";


const CdpViewPage = () => {
    const { width } = useWidth();
    const { control, register, tableComponentRef, tableColumns, tableActions, cdpFoundSt } = useCdpCrud();


    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Visualizar CDP</div>
                </section>
                <section className="card-user">
                    {/*                     <CdpHeadFormComponent isDisabled={true} detail={cdpFoundSt} />*/}
                    <CdpHeadFormComponent isDisabled={true} />
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