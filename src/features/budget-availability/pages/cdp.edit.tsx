import React from "react";
import CdpEditFormComponent from "../components/Edit/data-basic-cdp/cdp-head-edit-form-component";

const CdpEdit = () => {
  return (
    <div className="main-page">
      <div className="card-table gap-0">
        <section className="title-area">
          <div className="text-black weight-500 extra-large">Editar CDP</div>
        </section>
        <section className="card-user">
          <CdpEditFormComponent />
        </section>
      </div>
    </div>
  );
};

export default CdpEdit;
